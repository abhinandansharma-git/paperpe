"""
PaperPe Real-Time Feed Service
Broker-agnostic WebSocket infrastructure

Supports: Shoonya, Fyers, Angel One, Dhan
Swap credentials to switch brokers.
"""

import asyncio
import json
import logging
import os
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Set, Callable, Optional
import redis.asyncio as redis

logger = logging.getLogger(__name__)

# Config
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CHANNEL_PREFIX = "paperpe:tick:"


class BaseBrokerFeed(ABC):
    """Abstract base class for broker WebSocket feeds."""
    
    def __init__(self):
        self.subscribed_symbols: Set[str] = set()
        self.callbacks: List[Callable] = []
        self.connected = False
    
    @abstractmethod
    async def connect(self) -> bool:
        """Connect to broker WebSocket."""
        pass
    
    @abstractmethod
    async def subscribe(self, symbols: List[str]):
        """Subscribe to symbols."""
        pass
    
    @abstractmethod
    async def unsubscribe(self, symbols: List[str]):
        """Unsubscribe from symbols."""
        pass
    
    @abstractmethod
    async def disconnect(self):
        """Disconnect from broker."""
        pass
    
    def on_tick(self, callback: Callable):
        """Register tick callback."""
        self.callbacks.append(callback)
    
    async def emit_tick(self, tick: Dict):
        """Emit tick to all callbacks."""
        for cb in self.callbacks:
            try:
                if asyncio.iscoroutinefunction(cb):
                    await cb(tick)
                else:
                    cb(tick)
            except Exception as e:
                logger.error(f"Callback error: {e}")


class ShoonyaFeed(BaseBrokerFeed):
    """Shoonya/Finvasia WebSocket feed (FREE)."""
    
    def __init__(self, user_id: str, password: str, totp_secret: str, vendor_code: str = "", api_key: str = ""):
        super().__init__()
        self.user_id = user_id
        self.password = password
        self.totp_secret = totp_secret
        self.vendor_code = vendor_code
        self.api_key = api_key
        self.api = None
    
    async def connect(self) -> bool:
        try:
            from NorenRestApiPy.NorenApi import NorenApi
            import pyotp
            
            self.api = NorenApi(
                host="https://api.shoonya.com/NorenWClientTP/",
                websocket="wss://api.shoonya.com/NorenWSTP/"
            )
            
            totp = pyotp.TOTP(self.totp_secret).now()
            
            ret = self.api.login(
                userid=self.user_id,
                password=self.password,
                twoFA=totp,
                vendor_code=self.vendor_code,
                api_secret=self.api_key
            )
            
            if ret:
                self.api.start_websocket(
                    order_update_callback=lambda x: None,
                    subscribe_callback=self._on_message,
                    socket_open_callback=self._on_open,
                    socket_close_callback=self._on_close,
                    socket_error_callback=self._on_error
                )
                self.connected = True
                logger.info("Shoonya WebSocket connected")
                return True
        except Exception as e:
            logger.error(f"Shoonya connect failed: {e}")
        return False
    
    def _on_message(self, message):
        tick = {
            "symbol": message.get("tk"),
            "ltp": float(message.get("lp", 0)),
            "volume": int(message.get("v", 0)),
            "open": float(message.get("o", 0)),
            "high": float(message.get("h", 0)),
            "low": float(message.get("l", 0)),
            "close": float(message.get("c", 0)),
            "timestamp": datetime.now().isoformat(),
            "source": "shoonya"
        }
        asyncio.create_task(self.emit_tick(tick))
    
    def _on_open(self):
        logger.info("Shoonya socket opened")
        self.connected = True
    
    def _on_close(self):
        logger.warning("Shoonya socket closed")
        self.connected = False
    
    def _on_error(self, error):
        logger.error(f"Shoonya socket error: {error}")
    
    async def subscribe(self, symbols: List[str]):
        if self.api and self.connected:
            # Shoonya format: "NSE|26000" for NIFTY
            self.api.subscribe(symbols)
            self.subscribed_symbols.update(symbols)
    
    async def unsubscribe(self, symbols: List[str]):
        if self.api:
            self.api.unsubscribe(symbols)
            self.subscribed_symbols -= set(symbols)
    
    async def disconnect(self):
        if self.api:
            self.api.close_websocket()
            self.connected = False


class FyersFeed(BaseBrokerFeed):
    """Fyers WebSocket feed (FREE with account)."""
    
    def __init__(self, client_id: str, access_token: str):
        super().__init__()
        self.client_id = client_id
        self.access_token = access_token
        self.ws = None
    
    async def connect(self) -> bool:
        try:
            from fyers_apiv3 import fyersModel
            from fyers_apiv3.FyersWebsocket import data_ws
            
            self.ws = data_ws.FyersDataSocket(
                access_token=f"{self.client_id}:{self.access_token}",
                log_path="",
                litemode=False,
                write_to_file=False,
                reconnect=True,
                on_connect=self._on_open,
                on_close=self._on_close,
                on_error=self._on_error,
                on_message=self._on_message
            )
            
            self.ws.connect()
            self.connected = True
            logger.info("Fyers WebSocket connected")
            return True
        except Exception as e:
            logger.error(f"Fyers connect failed: {e}")
        return False
    
    def _on_message(self, message):
        if isinstance(message, dict) and "ltp" in message:
            tick = {
                "symbol": message.get("symbol"),
                "ltp": float(message.get("ltp", 0)),
                "volume": int(message.get("vol_traded_today", 0)),
                "open": float(message.get("open_price", 0)),
                "high": float(message.get("high_price", 0)),
                "low": float(message.get("low_price", 0)),
                "close": float(message.get("prev_close_price", 0)),
                "timestamp": datetime.now().isoformat(),
                "source": "fyers"
            }
            asyncio.create_task(self.emit_tick(tick))
    
    def _on_open(self):
        self.connected = True
    
    def _on_close(self):
        self.connected = False
    
    def _on_error(self, error):
        logger.error(f"Fyers error: {error}")
    
    async def subscribe(self, symbols: List[str]):
        if self.ws:
            # Fyers format: "NSE:NIFTY50-INDEX"
            self.ws.subscribe(symbols=symbols, data_type="SymbolUpdate")
            self.subscribed_symbols.update(symbols)
    
    async def unsubscribe(self, symbols: List[str]):
        if self.ws:
            self.ws.unsubscribe(symbols=symbols)
            self.subscribed_symbols -= set(symbols)
    
    async def disconnect(self):
        if self.ws:
            self.ws.close_connection()
            self.connected = False


class AngelOneFeed(BaseBrokerFeed):
    """Angel One SmartAPI WebSocket feed."""
    
    def __init__(self, api_key: str, client_id: str, password: str, totp_secret: str):
        super().__init__()
        self.api_key = api_key
        self.client_id = client_id
        self.password = password
        self.totp_secret = totp_secret
        self.ws = None
        self.auth_token = None
        self.feed_token = None
    
    async def connect(self) -> bool:
        try:
            from SmartApi import SmartConnect
            from SmartApi.smartWebSocketV2 import SmartWebSocketV2
            import pyotp
            
            # Login
            smart = SmartConnect(api_key=self.api_key)
            totp = pyotp.TOTP(self.totp_secret).now()
            
            data = smart.generateSession(self.client_id, self.password, totp)
            
            if data["status"]:
                self.auth_token = data["data"]["jwtToken"]
                self.feed_token = smart.getfeedToken()
                
                self.ws = SmartWebSocketV2(
                    self.auth_token,
                    self.api_key,
                    self.client_id,
                    self.feed_token
                )
                
                self.ws.on_data = self._on_message
                self.ws.on_open = self._on_open
                self.ws.on_close = self._on_close
                self.ws.on_error = self._on_error
                
                self.ws.connect()
                self.connected = True
                logger.info("Angel One WebSocket connected")
                return True
        except Exception as e:
            logger.error(f"Angel One connect failed: {e}")
        return False
    
    def _on_message(self, wsapp, message):
        tick = {
            "symbol": message.get("token"),
            "ltp": float(message.get("last_traded_price", 0)) / 100,
            "volume": int(message.get("volume_trade_for_the_day", 0)),
            "open": float(message.get("open_price_of_the_day", 0)) / 100,
            "high": float(message.get("high_price_of_the_day", 0)) / 100,
            "low": float(message.get("low_price_of_the_day", 0)) / 100,
            "close": float(message.get("closed_price", 0)) / 100,
            "timestamp": datetime.now().isoformat(),
            "source": "angelone"
        }
        asyncio.create_task(self.emit_tick(tick))
    
    def _on_open(self, wsapp):
        self.connected = True
    
    def _on_close(self, wsapp):
        self.connected = False
    
    def _on_error(self, wsapp, error):
        logger.error(f"Angel One error: {error}")
    
    async def subscribe(self, symbols: List[str]):
        if self.ws:
            # Angel format: [{"exchangeType": 1, "tokens": ["26000"]}]
            self.ws.subscribe("abc123", 1, symbols)
            self.subscribed_symbols.update(symbols)
    
    async def unsubscribe(self, symbols: List[str]):
        if self.ws:
            self.ws.unsubscribe("abc123", 1, symbols)
            self.subscribed_symbols -= set(symbols)
    
    async def disconnect(self):
        if self.ws:
            self.ws.close_connection()
            self.connected = False


class FeedDistributor:
    """Distributes ticks to Redis pub/sub for PaperPe clients."""
    
    def __init__(self, broker_feed: BaseBrokerFeed):
        self.feed = broker_feed
        self.redis: Optional[redis.Redis] = None
        self.running = False
    
    async def start(self):
        # Connect to Redis
        try:
            self.redis = await redis.from_url(REDIS_URL)
            await self.redis.ping()
            logger.info("Redis connected for distribution")
        except Exception as e:
            logger.error(f"Redis connection failed: {e}")
            return False
        
        # Register tick handler
        self.feed.on_tick(self._distribute_tick)
        
        # Connect broker
        connected = await self.feed.connect()
        if connected:
            self.running = True
            logger.info("Feed distributor started")
        
        return connected
    
    async def _distribute_tick(self, tick: Dict):
        """Publish tick to Redis channel."""
        if self.redis:
            symbol = tick.get("symbol", "unknown")
            channel = f"{CHANNEL_PREFIX}{symbol}"
            
            # Publish to channel
            await self.redis.publish(channel, json.dumps(tick))
            
            # Also cache latest tick
            await self.redis.setex(f"paperpe:latest:{symbol}", 60, json.dumps(tick))
    
    async def subscribe_symbols(self, symbols: List[str]):
        await self.feed.subscribe(symbols)
    
    async def stop(self):
        self.running = False
        await self.feed.disconnect()
        if self.redis:
            await self.redis.close()


# Default symbols to subscribe
DEFAULT_SYMBOLS = {
    "shoonya": [
        "NSE|26000",   # NIFTY
        "NSE|26009",   # BANKNIFTY  
        "NSE|2885",    # RELIANCE
        "NSE|3045",    # SBIN
        "NSE|1333",    # HDFCBANK
    ],
    "fyers": [
        "NSE:NIFTY50-INDEX",
        "NSE:NIFTYBANK-INDEX",
        "NSE:RELIANCE-EQ",
        "NSE:SBIN-EQ",
        "NSE:HDFCBANK-EQ",
    ],
    "angelone": [
        "26000",  # NIFTY
        "26009",  # BANKNIFTY
        "2885",   # RELIANCE
        "3045",   # SBIN
        "1333",   # HDFCBANK
    ]
}


if __name__ == "__main__":
    print("PaperPe Real-Time Feed Service")
    print("=" * 50)
    print("")
    print("Supported brokers:")
    print("  - Shoonya/Finvasia (FREE)")
    print("  - Fyers (FREE with account)")
    print("  - Angel One (FREE with account)")
    print("")
    print("Architecture:")
    print("  Broker WebSocket -> Redis Pub/Sub -> PaperPe SSE")
    print("")
    print("To run:")
    print("  1. Set broker credentials in .env")
    print("  2. python -m services.feed.run")
