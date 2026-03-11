"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Tick {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change?: number;
  pctChange?: number;
  timestamp: string;
  source: string;
}

interface UseRealTimeFeedOptions {
  symbols: string[];
  enabled?: boolean;
  onTick?: (tick: Tick) => void;
}

const FEED_URL = process.env.NEXT_PUBLIC_FEED_URL || "http://localhost:8001";

export function useRealTimeFeed({
  symbols,
  enabled = true,
  onTick,
}: UseRealTimeFeedOptions) {
  const [ticks, setTicks] = useState<Record<string, Tick>>({});
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!enabled || symbols.length === 0) return;

    const symbolsParam = symbols.join(",");
    const url = `${FEED_URL}/stream?symbols=${symbolsParam}`;

    try {
      const es = new EventSource(url);

      es.onopen = () => {
        setConnected(true);
        setError(null);
        console.log("SSE connected");
      };

      es.onmessage = (event) => {
        try {
          const tick: Tick = JSON.parse(event.data);
          
          // Calculate change if we have previous close
          if (tick.close && tick.ltp) {
            tick.change = tick.ltp - tick.close;
            tick.pctChange = ((tick.ltp - tick.close) / tick.close) * 100;
          }

          setTicks((prev) => ({
            ...prev,
            [tick.symbol]: tick,
          }));

          onTick?.(tick);
        } catch (e) {
          // Ignore heartbeat comments
        }
      };

      es.onerror = (e) => {
        console.error("SSE error:", e);
        setConnected(false);
        setError("Connection lost. Reconnecting...");
        
        // EventSource auto-reconnects
      };

      eventSourceRef.current = es;
    } catch (e) {
      setError(`Failed to connect: ${e}`);
    }
  }, [symbols, enabled, onTick]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ticks,
    connected,
    error,
    reconnect: connect,
    disconnect,
  };
}

// Simple hook for single symbol
export function useTickerPrice(symbol: string) {
  const { ticks, connected } = useRealTimeFeed({
    symbols: [symbol],
    enabled: !!symbol,
  });

  return {
    price: ticks[symbol]?.ltp,
    change: ticks[symbol]?.change,
    pctChange: ticks[symbol]?.pctChange,
    tick: ticks[symbol],
    connected,
  };
}

// Hook for watchlist
export function useWatchlist(symbols: string[]) {
  const { ticks, connected, error } = useRealTimeFeed({
    symbols,
    enabled: symbols.length > 0,
  });

  const watchlist = symbols.map((symbol) => ({
    ...ticks[symbol], symbol,
  }));

  return {
    watchlist,
    connected,
    error,
  };
}

export type { Tick };

