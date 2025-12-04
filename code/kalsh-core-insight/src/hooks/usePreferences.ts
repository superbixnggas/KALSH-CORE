import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { UserPreferences, DashboardMode, AlertUrgency } from '@/types';

interface UsePreferencesResult {
  preferences: UserPreferences | null;
  loading: boolean;
  error: Error | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<boolean>;
  setPreferredMode: (mode: DashboardMode) => Promise<boolean>;
  setNotificationsEnabled: (enabled: boolean) => Promise<boolean>;
  setAlertUrgencyFilter: (urgencies: AlertUrgency[]) => Promise<boolean>;
  addPreferredNarrative: (narrative: string) => Promise<boolean>;
  removePreferredNarrative: (narrative: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const DEFAULT_PREFERENCES: Partial<UserPreferences> = {
  preferred_mode: 'daily',
  notification_enabled: true,
  alert_urgency_filter: ['HIGH', 'MEDIUM', 'LOW'],
  preferred_narratives: [],
  timezone: 'UTC'
};

export function usePreferences(): UsePreferencesResult {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(null);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-preferences', {
        body: { action: 'get' }
      });

      if (error) throw error;
      setPreferences(data?.data || DEFAULT_PREFERENCES);
      setError(null);
    } catch (err) {
      console.error('Preferences fetch error:', err);
      // Use defaults on error
      setPreferences(DEFAULT_PREFERENCES as UserPreferences);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>): Promise<boolean> => {
    if (!user) {
      setError(new Error('Please sign in to save preferences'));
      return false;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-preferences', {
        body: { action: 'update', preferences: updates }
      });

      if (error) throw error;
      
      // Update local state
      setPreferences(prev => prev ? { ...prev, ...data?.data } : data?.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const setPreferredMode = useCallback(async (mode: DashboardMode): Promise<boolean> => {
    return updatePreferences({ preferred_mode: mode });
  }, [updatePreferences]);

  const setNotificationsEnabled = useCallback(async (enabled: boolean): Promise<boolean> => {
    return updatePreferences({ notification_enabled: enabled });
  }, [updatePreferences]);

  const setAlertUrgencyFilter = useCallback(async (urgencies: AlertUrgency[]): Promise<boolean> => {
    return updatePreferences({ alert_urgency_filter: urgencies });
  }, [updatePreferences]);

  const addPreferredNarrative = useCallback(async (narrative: string): Promise<boolean> => {
    const current = preferences?.preferred_narratives || [];
    if (current.includes(narrative)) return true;
    return updatePreferences({ preferred_narratives: [...current, narrative] });
  }, [preferences, updatePreferences]);

  const removePreferredNarrative = useCallback(async (narrative: string): Promise<boolean> => {
    const current = preferences?.preferred_narratives || [];
    return updatePreferences({ 
      preferred_narratives: current.filter(n => n !== narrative) 
    });
  }, [preferences, updatePreferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    setPreferredMode,
    setNotificationsEnabled,
    setAlertUrgencyFilter,
    addPreferredNarrative,
    removePreferredNarrative,
    refetch: fetchPreferences
  };
}
