import { useState, useEffect, useCallback } from 'react';
import { invokeEdgeFunction } from '@/lib/supabase';
import type { MarketStats } from '@/types';

interface UseMarketDataResult {
  data: MarketStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMarketData(refreshInterval = 60000): UseMarketDataResult {
  const [data, setData] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await invokeEdgeFunction<MarketStats>('fetchMarketData');
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch market data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Set up refresh interval
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}
