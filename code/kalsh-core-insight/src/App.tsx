import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useMarketData } from '@/hooks/useMarketData';
import { useInsights } from '@/hooks/useInsights';
import { useAlerts } from '@/hooks/useAlerts';
import { useWatchlist } from '@/hooks/useWatchlist';
import { usePreferences } from '@/hooks/usePreferences';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import FilterBar from '@/components/FilterBar';
import InsightCard from '@/components/InsightCard';
import AlertCard from '@/components/AlertCard';
import ExplorerCard from '@/components/ExplorerCard';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';
import WatchlistPanel from '@/components/WatchlistPanel';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { ToastProvider, useToast } from '@/components/Toast';
import type { DashboardMode, AlertUrgency } from '@/types';

function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [mode, setMode] = useState<DashboardMode>('daily');
  const [selectedUrgency, setSelectedUrgency] = useState<AlertUrgency[]>(['HIGH', 'MEDIUM', 'LOW']);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  // Data hooks
  const { data: marketData, loading: marketLoading, refetch: refetchMarket } = useMarketData(60000);
  const { 
    insights: dailyInsights, 
    loading: dailyLoading, 
    generateNew: generateDailyInsights 
  } = useInsights('daily');
  const { 
    insights: explorerInsights, 
    loading: explorerLoading, 
    generateNew: generateExplorerInsights 
  } = useInsights('explorer');
  const { 
    alerts, 
    loading: alertsLoading, 
    fetchNew: fetchNewAlerts,
    dismissAlert,
    saveAlert,
    savedAlerts,
    newAlertCount,
    clearNewAlertCount
  } = useAlerts(selectedUrgency);
  
  // Personalization hooks
  const {
    watchlist,
    loading: watchlistLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  } = useWatchlist();
  
  const { preferences, setPreferredMode, setAlertUrgencyFilter } = usePreferences();

  // Load preferences on mount
  useEffect(() => {
    if (preferences?.preferred_mode) {
      setMode(preferences.preferred_mode as DashboardMode);
    }
    if (preferences?.alert_urgency_filter) {
      setSelectedUrgency(preferences.alert_urgency_filter as AlertUrgency[]);
    }
  }, [preferences]);

  // Update last sync time
  useEffect(() => {
    if (!marketLoading && marketData) {
      setLastUpdate(new Date());
      setIsConnected(true);
    }
  }, [marketData, marketLoading]);

  // Clear new alert count when viewing live mode
  useEffect(() => {
    if (mode === 'live' && newAlertCount > 0) {
      clearNewAlertCount();
    }
  }, [mode, newAlertCount, clearNewAlertCount]);

  // Handle mode change with preference save
  const handleModeChange = useCallback((newMode: DashboardMode) => {
    setMode(newMode);
    if (user) {
      setPreferredMode(newMode);
    }
  }, [user, setPreferredMode]);

  // Handle urgency filter change with preference save
  const handleUrgencyChange = useCallback((urgencies: AlertUrgency[]) => {
    setSelectedUrgency(urgencies);
    if (user) {
      setAlertUrgencyFilter(urgencies);
    }
  }, [user, setAlertUrgencyFilter]);

  // Handle refresh based on mode
  const handleRefresh = useCallback(async () => {
    switch (mode) {
      case 'daily':
        await Promise.all([refetchMarket(), generateDailyInsights('daily')]);
        showToast('Daily insights telah diperbarui', 'success');
        break;
      case 'live':
        await fetchNewAlerts();
        showToast('Alerts telah diperbarui', 'success');
        break;
      case 'explorer':
        await generateExplorerInsights('explorer');
        showToast('Explorer insights telah diperbarui', 'success');
        break;
    }
    setLastUpdate(new Date());
  }, [mode, refetchMarket, generateDailyInsights, fetchNewAlerts, generateExplorerInsights, showToast]);

  // Handle add to watchlist
  const handleAddToWatchlist = useCallback(async (symbol: string, name: string) => {
    if (!user) {
      showToast('Silakan login untuk menggunakan watchlist', 'warning');
      return;
    }
    
    const success = await addToWatchlist(symbol, name);
    if (success) {
      showToast(`${symbol} ditambahkan ke watchlist`, 'success');
    } else {
      showToast('Gagal menambahkan ke watchlist', 'error');
    }
  }, [user, addToWatchlist, showToast]);

  // Handle remove from watchlist
  const handleRemoveFromWatchlist = useCallback(async (watchlistId: string) => {
    const success = await removeFromWatchlist(watchlistId);
    if (success) {
      showToast('Dihapus dari watchlist', 'info');
    }
  }, [removeFromWatchlist, showToast]);

  // Handle save alert
  const handleSaveAlert = useCallback((alertId: string) => {
    saveAlert(alertId);
    showToast(savedAlerts.has(alertId) ? 'Alert dihapus dari simpanan' : 'Alert disimpan', 'info');
  }, [saveAlert, savedAlerts, showToast]);

  // Filter insights by category
  const filteredDailyInsights = dailyInsights.filter(insight => 
    selectedCategory === 'all' || insight.narrative_category === selectedCategory
  );

  const filteredExplorerInsights = explorerInsights.filter(insight =>
    selectedCategory === 'all' || insight.narrative_category === selectedCategory
  );

  // Filter alerts by urgency
  const filteredAlerts = alerts.filter(alert =>
    selectedUrgency.includes(alert.urgency)
  );

  // Get current loading state
  const isLoading = mode === 'daily' ? dailyLoading : 
                    mode === 'live' ? alertsLoading : 
                    explorerLoading;

  // Get current data
  const currentInsights = mode === 'daily' ? filteredDailyInsights : filteredExplorerInsights;
  const hasData = mode === 'live' ? filteredAlerts.length > 0 : currentInsights.length > 0;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <Header 
        currentMode={mode}
        onModeChange={handleModeChange}
        isConnected={isConnected}
        lastSync={lastUpdate}
        newAlertCount={newAlertCount}
        onWatchlistClick={() => setWatchlistOpen(true)}
        watchlistCount={watchlist.length}
      />

      {/* Stats Bar */}
      <StatsBar data={marketData} loading={marketLoading} />

      {/* Filter Bar */}
      <FilterBar
        mode={mode}
        selectedUrgency={selectedUrgency}
        selectedTimeframe={selectedTimeframe}
        selectedCategory={selectedCategory}
        onUrgencyChange={handleUrgencyChange}
        onTimeframeChange={setSelectedTimeframe}
        onCategoryChange={setSelectedCategory}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          {/* Loading State */}
          {isLoading && !hasData && (
            <GridSkeleton count={6} type={mode === 'live' ? 'alert' : 'card'} />
          )}

          {/* Empty State */}
          {!isLoading && !hasData && (
            <EmptyState 
              mode={mode} 
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          )}

          {/* Daily Insights */}
          {mode === 'daily' && hasData && (
            <div className="insight-grid">
              {filteredDailyInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}

          {/* Live Alerts */}
          {mode === 'live' && hasData && (
            <div className="insight-grid">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={() => dismissAlert(alert.id)}
                  onViewDetails={() => {}}
                  onAddToWatchlist={() => handleAddToWatchlist(alert.symbol, alert.symbol)}
                  onSave={() => handleSaveAlert(alert.id)}
                  isInWatchlist={isInWatchlist(alert.symbol)}
                  isSaved={savedAlerts.has(alert.id)}
                />
              ))}
            </div>
          )}

          {/* Explorer Insights */}
          {mode === 'explorer' && hasData && (
            <div className="insight-grid">
              {filteredExplorerInsights.map((insight) => (
                <ExplorerCard
                  key={insight.id}
                  insight={insight}
                  onClick={() => {}}
                  onAddToWatch={() => {
                    const symbol = insight.title.match(/\(([^)]+)\)/)?.[1] || insight.title.split(' ')[0];
                    handleAddToWatchlist(symbol, insight.title);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer lastUpdate={lastUpdate} isConnected={isConnected} />

      {/* Watchlist Panel */}
      <WatchlistPanel
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlist={watchlist}
        loading={watchlistLoading}
        onRemove={handleRemoveFromWatchlist}
        onAdd={handleAddToWatchlist}
      />
    </div>
  );
}

function DashboardWithToast() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardWithToast />
    </AuthProvider>
  );
}
