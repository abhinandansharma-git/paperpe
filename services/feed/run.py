"""
Run PaperPe Feed Service

Usage:
  python -m services.feed.run --broker shoonya
  python -m services.feed.run --broker fyers
  python -m services.feed.run --broker angelone
"""

import asyncio
import argparse
import os
import logging
from dotenv import load_dotenv

from .broker_feeds import (
    ShoonyaFeed, FyersFeed, AngelOneFeed,
    FeedDistributor, DEFAULT_SYMBOLS
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()


def create_feed(broker: str):
    """Create broker feed based on name."""
    
    if broker == "shoonya":
        return ShoonyaFeed(
            user_id=os.getenv("SHOONYA_USER_ID"),
            password=os.getenv("SHOONYA_PASSWORD"),
            totp_secret=os.getenv("SHOONYA_TOTP_SECRET"),
            vendor_code=os.getenv("SHOONYA_VENDOR_CODE", ""),
            api_key=os.getenv("SHOONYA_API_KEY", "")
        )
    
    elif broker == "fyers":
        return FyersFeed(
            client_id=os.getenv("FYERS_CLIENT_ID"),
            access_token=os.getenv("FYERS_ACCESS_TOKEN")
        )
    
    elif broker == "angelone":
        return AngelOneFeed(
            api_key=os.getenv("ANGEL_API_KEY"),
            client_id=os.getenv("ANGEL_CLIENT_ID"),
            password=os.getenv("ANGEL_PASSWORD"),
            totp_secret=os.getenv("ANGEL_TOTP_SECRET")
        )
    
    else:
        raise ValueError(f"Unknown broker: {broker}")


async def main(broker: str):
    logger.info(f"Starting PaperPe Feed Service with {broker}")
    
    # Create feed
    feed = create_feed(broker)
    
    # Create distributor
    distributor = FeedDistributor(feed)
    
    # Start
    connected = await distributor.start()
    if not connected:
        logger.error("Failed to connect. Check credentials.")
        return
    
    # Subscribe to default symbols
    symbols = DEFAULT_SYMBOLS.get(broker, [])
    await distributor.subscribe_symbols(symbols)
    logger.info(f"Subscribed to {len(symbols)} symbols")
    
    # Run forever
    try:
        while distributor.running:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        await distributor.stop()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--broker", choices=["shoonya", "fyers", "angelone"], default="shoonya")
    args = parser.parse_args()
    
    asyncio.run(main(args.broker))
