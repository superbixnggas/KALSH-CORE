import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, AlertTriangle, Layers } from 'lucide-react';
import type { MarketStats } from '@/types';

interface StatsBarProps {
  data: MarketStats | null;
  loading: boolean;
}

const formatMarketCap = (value: number | undefined): string => {
  if (!value) return '$0';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
};

const formatPrice = (value: number | undefined): string => {
  if (!value) return '$0';
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

const getTrendIcon = (trend: string | undefined) => {
  if (!trend) return <Minus className="w-4 h-4 text-text-muted" />;
  if (trend.includes('BULLISH')) return <TrendingUp className="w-4 h-4 text-status-bullish" />;
  if (trend.includes('BEARISH')) return <TrendingDown className="w-4 h-4 text-status-bearish" />;
  return <Minus className="w-4 h-4 text-text-muted" />;
};

const getTrendLabel = (trend: string | undefined): string => {
  const labels: Record<string, string> = {
    'BULLISH': 'Bullish',
    'SLIGHTLY_BULLISH': 'Sedikit Bullish',
    'NEUTRAL': 'Netral',
    'SLIGHTLY_BEARISH': 'Sedikit Bearish',
    'BEARISH': 'Bearish',
  };
  return labels[trend || ''] || 'Loading...';
};

const getFearGreedLabel = (index: number | undefined): { label: string; color: string } => {
  if (!index) return { label: 'Loading...', color: 'text-text-muted' };
  if (index <= 25) return { label: 'Ketakutan Ekstrem', color: 'text-status-bearish' };
  if (index <= 45) return { label: 'Ketakutan', color: 'text-accent-warning' };
  if (index <= 55) return { label: 'Netral', color: 'text-text-secondary' };
  if (index <= 75) return { label: 'Keserakahan', color: 'text-accent-primary' };
  return { label: 'Keserakahan Ekstrem', color: 'text-status-bullish' };
};

export default function StatsBar({ data, loading }: StatsBarProps) {
  const fearGreed = getFearGreedLabel(data?.fear_greed_index);

  if (loading && !data) {
    return (
      <div className="bg-bg-surface border-y border-accent-primary/15">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-accent-primary/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-bg-surface stats-item">
                <div className="skeleton h-3 w-20 rounded mb-2" />
                <div className="skeleton h-6 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border-y border-accent-primary/15">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-accent-primary/10">
          {/* Market Trend */}
          <div className="bg-bg-surface stats-item">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3 text-text-muted" />
              <span className="data-label">Tren Pasar</span>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(data?.trend)}
              <span className={`text-data font-bold ${
                data?.trend?.includes('BULLISH') ? 'text-status-bullish' : 
                data?.trend?.includes('BEARISH') ? 'text-status-bearish' : 
                'text-text-primary'
              }`}>
                {getTrendLabel(data?.trend)}
              </span>
            </div>
          </div>

          {/* BTC Dominance */}
          <div className="bg-bg-surface stats-item">
            <div className="flex items-center gap-1 mb-1">
              <Layers className="w-3 h-3 text-text-muted" />
              <span className="data-label">BTC Dominance</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-data-lg text-text-primary font-bold">
                {data?.btc_dominance?.toFixed(1) || '--'}%
              </span>
            </div>
          </div>

          {/* Fear & Greed */}
          <div className="bg-bg-surface stats-item">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-text-muted" />
              <span className="data-label">Fear & Greed</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-data-lg text-text-primary font-bold">
                {data?.fear_greed_index ?? '--'}
              </span>
              <span className={`text-xs ${fearGreed.color}`}>
                {fearGreed.label}
              </span>
            </div>
          </div>

          {/* Active Narratives */}
          <div className="bg-bg-surface stats-item">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-text-muted" />
              <span className="data-label">Narratives Aktif</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-data-lg text-accent-primary font-bold">
                {data?.active_narratives ?? '--'}
              </span>
              <span className="text-xs text-text-muted">
                sedang trending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
