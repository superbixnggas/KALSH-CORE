import React from 'react';
import { Filter, ChevronDown, RefreshCw } from 'lucide-react';
import type { DashboardMode, AlertUrgency } from '@/types';

interface FilterBarProps {
  mode: DashboardMode;
  selectedUrgency: AlertUrgency[];
  selectedTimeframe: string;
  selectedCategory: string;
  onUrgencyChange: (urgencies: AlertUrgency[]) => void;
  onTimeframeChange: (timeframe: string) => void;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const timeframes = [
  { value: 'all', label: 'Semua' },
  { value: '1h', label: '1 Jam' },
  { value: '24h', label: '24 Jam' },
  { value: '7d', label: '7 Hari' },
];

const categories = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'market_overview', label: 'Market Overview' },
  { value: 'sentiment', label: 'Sentiment' },
  { value: 'risk', label: 'Risk Assessment' },
  { value: 'trending', label: 'Trending' },
];

const urgencyLevels: { value: AlertUrgency; label: string; color: string }[] = [
  { value: 'HIGH', label: 'Tinggi', color: 'text-alert-high border-alert-high' },
  { value: 'MEDIUM', label: 'Sedang', color: 'text-alert-medium border-alert-medium' },
  { value: 'LOW', label: 'Rendah', color: 'text-alert-low border-alert-low' },
];

export default function FilterBar({
  mode,
  selectedUrgency,
  selectedTimeframe,
  selectedCategory,
  onUrgencyChange,
  onTimeframeChange,
  onCategoryChange,
  onRefresh,
  isLoading,
}: FilterBarProps) {
  const toggleUrgency = (urgency: AlertUrgency) => {
    if (selectedUrgency.includes(urgency)) {
      onUrgencyChange(selectedUrgency.filter(u => u !== urgency));
    } else {
      onUrgencyChange([...selectedUrgency, urgency]);
    }
  };

  return (
    <div className="bg-bg-surface border-b border-accent-primary/10">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Icon */}
          <div className="flex items-center gap-2 text-text-muted mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider hidden sm:inline">Filter</span>
          </div>

          {/* Timeframe Filter - Show for Daily and Explorer */}
          {(mode === 'daily' || mode === 'explorer') && (
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => onTimeframeChange(tf.value)}
                  className={`filter-chip whitespace-nowrap ${
                    selectedTimeframe === tf.value ? 'active' : ''
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}

          {/* Urgency Filter - Show for Live Alerts */}
          {mode === 'live' && (
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {urgencyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => toggleUrgency(level.value)}
                  className={`filter-chip whitespace-nowrap ${
                    selectedUrgency.includes(level.value) 
                      ? `active ${level.color}` 
                      : ''
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          )}

          {/* Category Filter - Show for Daily and Explorer */}
          {(mode === 'daily' || mode === 'explorer') && (
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="appearance-none bg-bg-base border border-accent-primary/20 rounded-sm
                         px-4 py-2 pr-8 text-small text-text-primary
                         focus:outline-none focus:border-accent-primary cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-small text-text-secondary
                     hover:text-accent-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
