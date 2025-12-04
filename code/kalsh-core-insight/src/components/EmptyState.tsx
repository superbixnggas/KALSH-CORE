import React from 'react';
import { BarChart2, Zap, Compass, RefreshCw } from 'lucide-react';
import type { DashboardMode } from '@/types';

interface EmptyStateProps {
  mode: DashboardMode;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const modeContent: Record<DashboardMode, { icon: React.ReactNode; title: string; description: string }> = {
  daily: {
    icon: <BarChart2 className="w-12 h-12" />,
    title: 'Belum Ada Daily Insight',
    description: 'Insights harian sedang diproses. Klik refresh untuk mengambil data terbaru.',
  },
  live: {
    icon: <Zap className="w-12 h-12" />,
    title: 'Tidak Ada Alert Aktif',
    description: 'Tidak ada aktivitas signifikan saat ini. Alerts akan muncul saat terjadi pergerakan penting.',
  },
  explorer: {
    icon: <Compass className="w-12 h-12" />,
    title: 'Memindai Narratives',
    description: 'Sedang mencari emerging narratives. Klik refresh untuk mencari peluang baru.',
  },
};

export default function EmptyState({ mode, onRefresh, isLoading }: EmptyStateProps) {
  const content = modeContent[mode];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-md bg-bg-surface border border-accent-primary/20 text-accent-primary/50 mb-6">
        {content.icon}
      </div>
      <h3 className="text-h3 text-text-primary mb-2 text-center">
        {content.title}
      </h3>
      <p className="text-small text-text-secondary text-center max-w-md mb-6">
        {content.description}
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </button>
      )}
    </div>
  );
}
