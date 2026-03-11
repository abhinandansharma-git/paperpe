"""
PaperPe SSE Server - Streams real-time ticks to frontend
"""

import asyncio
import json
import logging
import os
from typing import Set
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CHANNEL_PREFIX = "paperpe:tick:"

app = FastAPI(title="PaperPe Real-Time Feed")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active SSE connections
active_connections: Set = set()


async def event_generator(symbols: list, request: Request):
    """Generate SSE events from Redis pub/sub."""
    r = await redis.from_url(REDIS_URL)
    pubsub = r.pubsub()
    
    # Subscribe to requested symbols
    channels = [f"{CHANNEL_PREFIX}{s}" for s in symbols]
    await pubsub.subscribe(*channels)
    
    try:
        while True:
            if await request.is_disconnected():
                break
            
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            
            if message and message["type"] == "message":
                data = message["data"]
                if isinstance(data, bytes):
                    data = data.decode("utf-8")
                yield f"data: {data}\n\n"
            else:
                # Heartbeat
                yield f": heartbeat\n\n"
            
            await asyncio.sleep(0.1)
    finally:
        await pubsub.unsubscribe(*channels)
        await r.close()


@app.get("/stream")
async def stream_ticks(request: Request, symbols: str = "NIFTY,BANKNIFTY"):
    """Stream real-time ticks via SSE.
    
    Usage: GET /stream?symbols=NIFTY,BANKNIFTY,RELIANCE
    """
    symbol_list = [s.strip().upper() for s in symbols.split(",")]
    
    return StreamingResponse(
        event_generator(symbol_list, request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/latest/{symbol}")
async def get_latest(symbol: str):
    """Get latest cached tick for a symbol."""
    r = await redis.from_url(REDIS_URL)
    
    data = await r.get(f"paperpe:latest:{symbol.upper()}")
    await r.close()
    
    if data:
        return json.loads(data)
    return {"error": "No data", "symbol": symbol}


@app.get("/latest")
async def get_all_latest(symbols: str = "NIFTY,BANKNIFTY"):
    """Get latest ticks for multiple symbols."""
    r = await redis.from_url(REDIS_URL)
    symbol_list = [s.strip().upper() for s in symbols.split(",")]
    
    result = {}
    for symbol in symbol_list:
        data = await r.get(f"paperpe:latest:{symbol}")
        if data:
            result[symbol] = json.loads(data)
    
    await r.close()
    return result


@app.get("/health")
async def health():
    """Health check."""
    try:
        r = await redis.from_url(REDIS_URL)
        await r.ping()
        await r.close()
        return {"status": "ok", "redis": "connected"}
    except Exception as e:
        return {"status": "degraded", "redis": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
