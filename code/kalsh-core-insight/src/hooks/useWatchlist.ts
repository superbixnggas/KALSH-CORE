import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { WatchlistItem } from '@/types';

interface UseWatchlistResult {
  watchlist: WatchlistItem[];
  loading: boolean;
  error: Error | null;
  addToWatchlist: (symbol: string, name: string, category?: string, notes?: string) => Promise<boolean>;
  removeFromWatchlist: (watchlistId: string) => Promise<boolean>;
  updateWatchlistItem: (watchlistId: string, updates: Partial<WatchlistItem>) => Promise<boolean>;
  isInWatchlist: (symbol: string) => boolean;
  refetch: () => Promise<void>;
}

export function useWatchlist(): UseWatchlistResult {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWatchlist = useCallback(async () => {
    if (!user) {
      setWatchlist([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-watchlist', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setWatchlist(data?.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch watchlist'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToWatchlist = useCallback(async (
    symbol: string, 
    name: string, 
    category?: string, 
    notes?: string
  ): Promise<boolean> => {
    if (!user) {
      setError(new Error('Please sign in to use watchlist'));
      return false;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-watchlist', {
        body: { action: 'add', symbol, name, category, notes }
      });

      if (error) throw error;
      
      // Update local state
      if (data?.data?.item) {
        setWatchlist(prev => {
          const exists = prev.some(item => item.symbol === symbol.toUpperCase());
          if (exists) return prev;
          return [data.data.item, ...prev];
        });
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add to watchlist'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeFromWatchlist = useCallback(async (watchlistId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('manage-watchlist', {
        body: { action: 'remove', watchlistId }
      });

      if (error) throw error;
      
      // Update local state
      setWatchlist(prev => prev.filter(item => item.id !== watchlistId));
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove from watchlist'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateWatchlistItem = useCallback(async (
    watchlistId: string, 
    updates: Partial<WatchlistItem>
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-watchlist', {
        body: { action: 'update', watchlistId, ...updates }
      });

      if (error) throw error;
      
      // Update local state
      if (data?.data) {
        setWatchlist(prev => prev.map(item => 
          item.id === watchlistId ? { ...item, ...data.data } : item
        ));
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update watchlist item'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isInWatchlist = useCallback((symbol: string): boolean => {
    return watchlist.some(item => item.symbol.toUpperCase() === symbol.toUpperCase());
  }, [watchlist]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('watchlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'watchlists',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setWatchlist(prev => [payload.new as WatchlistItem, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setWatchlist(prev => prev.filter(item => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setWatchlist(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as WatchlistItem : item
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    isInWatchlist,
    refetch: fetchWatchlist
  };
}
