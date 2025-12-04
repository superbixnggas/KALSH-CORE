import { useState, useEffect, useCallback } from 'react';
import { supabase, invokeEdgeFunction } from '@/lib/supabase';
import type { Insight, InsightMode } from '@/types';

interface UseInsightsResult {
  insights: Insight[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  generateNew: (mode: InsightMode) => Promise<void>;
}

export function useInsights(mode: InsightMode = 'daily'): UseInsightsResult {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch from database
      const query = supabase
        .from('insights')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (mode !== 'all') {
        query.eq('mode', mode);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;

      // If no insights found, generate new ones
      if (!data || data.length === 0) {
        await generateNew(mode);
        return;
      }

      setInsights(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch insights'));
    } finally {
      setLoading(false);
    }
  }, [mode]);

  const generateNew = useCallback(async (generateMode: InsightMode) => {
    try {
      setLoading(true);
      const result = await invokeEdgeFunction<{ insights: Insight[] }>('generateInsights', { mode: generateMode });
      setInsights(result.insights || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate insights'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { insights, loading, error, refetch: fetchInsights, generateNew };
}
