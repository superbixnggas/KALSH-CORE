import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, invokeEdgeFunction, subscribeToAlerts } from '@/lib/supabase';
import type { Alert, AlertUrgency } from '@/types';

interface UseAlertsResult {
  alerts: Alert[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchNew: () => Promise<void>;
  dismissAlert: (alertId: string) => void;
  saveAlert: (alertId: string) => void;
  savedAlerts: Set<string>;
  newAlertCount: number;
  clearNewAlertCount: () => void;
}

export function useAlerts(urgencyFilter?: AlertUrgency[], refreshInterval = 90000): UseAlertsResult {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [savedAlerts, setSavedAlerts] = useState<Set<string>>(new Set());
  const [newAlertCount, setNewAlertCount] = useState(0);
  const lastFetchTime = useRef<Date>(new Date());

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch from database
      let query = supabase
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(30);

      if (urgencyFilter && urgencyFilter.length > 0) {
        query = query.in('urgency', urgencyFilter);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;

      // If no alerts found or data is stale, fetch new ones
      if (!data || data.length === 0) {
        await fetchNew();
        return;
      }

      // Check if data is stale (older than 2 hours)
      const latestAlert = data[0];
      const alertTime = new Date(latestAlert.created_at);
      const isStale = Date.now() - alertTime.getTime() > 2 * 60 * 60 * 1000;

      if (isStale) {
        await fetchNew();
        return;
      }

      // Filter out dismissed alerts
      const filteredAlerts = data.filter(alert => !dismissedIds.has(alert.id));
      setAlerts(filteredAlerts);
      setError(null);
      lastFetchTime.current = new Date();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch alerts'));
    } finally {
      setLoading(false);
    }
  }, [urgencyFilter, dismissedIds]);

  const fetchNew = useCallback(async () => {
    try {
      setLoading(true);
      // Use advanced-signals for better data
      const result = await invokeEdgeFunction<{ signals: Alert[] }>('advancedSignals', {
        signalType: 'all',
        symbols: ['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon', 'avalanche-2', 'chainlink', 'polkadot']
      });
      
      const newAlerts = (result.signals || []).filter(alert => !dismissedIds.has(alert.id));
      
      // Apply urgency filter
      const filtered = urgencyFilter && urgencyFilter.length > 0
        ? newAlerts.filter(alert => urgencyFilter.includes(alert.urgency))
        : newAlerts;
      
      // Count truly new alerts (not seen before)
      const previousIds = new Set(alerts.map(a => a.id));
      const brandNew = filtered.filter(a => !previousIds.has(a.id));
      if (brandNew.length > 0) {
        setNewAlertCount(prev => prev + brandNew.length);
      }
      
      setAlerts(filtered);
      setError(null);
      lastFetchTime.current = new Date();
    } catch (err) {
      // Fallback to basic whale alerts
      try {
        const result = await invokeEdgeFunction<{ alerts: Alert[] }>('fetchWhaleAlerts');
        const newAlerts = (result.alerts || []).filter(alert => !dismissedIds.has(alert.id));
        setAlerts(newAlerts);
      } catch (fallbackErr) {
        setError(err instanceof Error ? err : new Error('Failed to fetch new alerts'));
      }
    } finally {
      setLoading(false);
    }
  }, [dismissedIds, urgencyFilter, alerts]);

  const dismissAlert = useCallback((alertId: string) => {
    setDismissedIds(prev => new Set(prev).add(alertId));
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const saveAlert = useCallback((alertId: string) => {
    setSavedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  }, []);

  const clearNewAlertCount = useCallback(() => {
    setNewAlertCount(0);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Refetch when filter changes
  useEffect(() => {
    if (alerts.length > 0) {
      const filtered = urgencyFilter && urgencyFilter.length > 0
        ? alerts.filter(alert => urgencyFilter.includes(alert.urgency))
        : alerts;
      // Only update if filter actually changes the result
      if (filtered.length !== alerts.length) {
        fetchAlerts();
      }
    }
  }, [urgencyFilter]);

  // Set up refresh interval
  useEffect(() => {
    const interval = setInterval(fetchNew, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchNew, refreshInterval]);

  // Set up realtime subscription
  useEffect(() => {
    const unsubscribe = subscribeToAlerts((payload) => {
      const newAlert = payload.new as Alert;
      
      // Check if should be shown based on urgency filter
      if (urgencyFilter && urgencyFilter.length > 0 && !urgencyFilter.includes(newAlert.urgency)) {
        return;
      }
      
      // Check if not dismissed
      if (dismissedIds.has(newAlert.id)) {
        return;
      }
      
      // Add to alerts with animation trigger
      setAlerts(prev => {
        // Prevent duplicates
        if (prev.some(a => a.id === newAlert.id)) return prev;
        return [newAlert, ...prev].slice(0, 30);
      });
      
      setNewAlertCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [urgencyFilter, dismissedIds]);

  return { 
    alerts, 
    loading, 
    error, 
    refetch: fetchAlerts, 
    fetchNew, 
    dismissAlert,
    saveAlert,
    savedAlerts,
    newAlertCount,
    clearNewAlertCount
  };
}
