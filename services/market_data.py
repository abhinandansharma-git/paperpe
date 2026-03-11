import json
import logging
from typing import Optional, Dict
from datetime import datetime
import redis
import os

logger = logging.getLogger(__name__)

# Redis connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CACHE_TTL = int(os.getenv("CACHE_TTL", 60))  # 60 seconds default

# Data sources
try:
    from nsepython import index_info, nse_optionchain_scrapper, nse_eq
    HAS_NSEPYTHON = True
except ImportError:
    HAS_NSEPYTHON = False

try:
    import yfinance as yf
    HAS_YFINANCE = True
except ImportError:
    HAS_YFINANCE = False


class MarketDataService:
    """Market data service with Redis caching."""
    
    def __init__(self):
        self.redis = None
        self._connect_redis()
        logger.info(f"MarketDataService: nsepython={HAS_NSEPYTHON}, yfinance={HAS_YFINANCE}, redis={self.redis is not None}")
    
    def _connect_redis(self):
        try:
            self.redis = redis.from_url(REDIS_URL, decode_responses=True)
            self.redis.ping()
            logger.info("Redis connected")
        except Exception as e:
            logger.warning(f"Redis not available: {e}. Running without cache.")
            self.redis = None
    
    def _cache_get(self, key: str) -> Optional[Dict]:
        if not self.redis:
            return None
        try:
            data = self.redis.get(key)
            if data:
                return json.loads(data)
        except Exception as e:
            logger.error(f"Cache get error: {e}")
        return None
    
    def _cache_set(self, key: str, value: Dict, ttl: int = None):
        if not self.redis:
            return
        try:
            self.redis.setex(key, ttl or CACHE_TTL, json.dumps(value))
        except Exception as e:
            logger.error(f"Cache set error: {e}")
    
    def get_index(self, index_name: str) -> Optional[Dict]:
        cache_key = f"index:{index_name}"
        
        # Check cache
        cached = self._cache_get(cache_key)
        if cached:
            cached["_cached"] = True
            return cached
        
        # Fetch fresh
        data = None
        if HAS_NSEPYTHON:
            try:
                raw = index_info(index_name)
                if raw:
                    data = {
                        "symbol": index_name,
                        "lastPrice": raw.get("last"),
                        "open": raw.get("open"),
                        "high": raw.get("high"),
                        "low": raw.get("low"),
                        "previousClose": raw.get("previousClose"),
                        "change": raw.get("change"),
                        "pctChange": raw.get("percChange"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nsepython"
                    }
            except Exception as e:
                logger.warning(f"nsepython index error: {e}")
        
        # Fallback to yfinance
        if not data and HAS_YFINANCE:
            yahoo_map = {"NIFTY 50": "^NSEI", "NIFTY BANK": "^NSEBANK", "SENSEX": "^BSESN"}
            symbol = yahoo_map.get(index_name)
            if symbol:
                data = self._yf_quote(symbol, index_name)
        
        if data:
            self._cache_set(cache_key, data)
        
        return data
    
    def get_stock(self, symbol: str) -> Optional[Dict]:
        cache_key = f"stock:{symbol}"
        
        cached = self._cache_get(cache_key)
        if cached:
            cached["_cached"] = True
            return cached
        
        data = None
        if HAS_NSEPYTHON:
            try:
                raw = nse_eq(symbol)
                if raw:
                    info = raw.get("priceInfo", {})
                    data = {
                        "symbol": symbol,
                        "lastPrice": info.get("lastPrice"),
                        "open": info.get("open"),
                        "high": info.get("intraDayHighLow", {}).get("max"),
                        "low": info.get("intraDayHighLow", {}).get("min"),
                        "previousClose": info.get("previousClose"),
                        "change": info.get("change"),
                        "pctChange": info.get("pChange"),
                        "volume": raw.get("preOpenMarket", {}).get("totalTradedVolume"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nsepython"
                    }
            except Exception as e:
                logger.warning(f"nsepython stock error: {e}")
        
        if not data and HAS_YFINANCE:
            data = self._yf_quote(f"{symbol}.NS", symbol)
        
        if data:
            self._cache_set(cache_key, data)
        
        return data
    
    def get_option_chain(self, symbol: str) -> Optional[Dict]:
        cache_key = f"oc:{symbol}"
        
        cached = self._cache_get(cache_key)
        if cached:
            cached["_cached"] = True
            return cached
        
        if HAS_NSEPYTHON:
            try:
                data = nse_optionchain_scrapper(symbol)
                if data:
                    result = {
                        "symbol": symbol,
                        "data": data,
                        "timestamp": datetime.now().isoformat(),
                        "source": "nsepython"
                    }
                    self._cache_set(cache_key, result, ttl=30)  # Shorter TTL for OC
                    return result
            except Exception as e:
                logger.error(f"Option chain error: {e}")
        
        return None
    
    def _yf_quote(self, yf_symbol: str, display_symbol: str) -> Optional[Dict]:
        try:
            ticker = yf.Ticker(yf_symbol)
            hist = ticker.history(period="1d")
            if len(hist) > 0:
                last = hist.iloc[-1]
                return {
                    "symbol": display_symbol,
                    "lastPrice": float(last["Close"]),
                    "open": float(last["Open"]),
                    "high": float(last["High"]),
                    "low": float(last["Low"]),
                    "volume": int(last["Volume"]),
                    "change": float(last["Close"] - last["Open"]),
                    "pctChange": round((last["Close"] - last["Open"]) / last["Open"] * 100, 2),
                    "timestamp": datetime.now().isoformat(),
                    "source": "yfinance"
                }
        except Exception as e:
            logger.error(f"yfinance error: {e}")
        return None
    
    def get_indices(self) -> Dict:
        indices = ["NIFTY 50", "NIFTY BANK", "NIFTY IT", "NIFTY MIDCAP 50"]
        result = {}
        for idx in indices:
            data = self.get_index(idx)
            if data:
                result[idx] = data
        return result


# Singleton
_service = None

def get_market_data_service() -> MarketDataService:
    global _service
    if _service is None:
        _service = MarketDataService()
    return _service


if __name__ == "__main__":
    print("MarketDataService Test")
    print("=" * 40)
    
    svc = MarketDataService()
    
    print("\nNIFTY 50 (fresh):")
    d = svc.get_index("NIFTY 50")
    print(f"  {d.get('lastPrice')} | cached={d.get('_cached', False)}")
    
    print("\nNIFTY 50 (cached):")
    d = svc.get_index("NIFTY 50")
    print(f"  {d.get('lastPrice')} | cached={d.get('_cached', False)}")
    
    print("\nRELIANCE:")
    d = svc.get_stock("RELIANCE")
    print(f"  {d.get('lastPrice')} | source={d.get('source')}")
    
    print("\nDone!")
