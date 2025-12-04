import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity,
  Target,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import type { Insight, InsightStatus } from '@/types';

interface InsightCardProps {
  insight: Insight;
  onClick?: () => void;
}

const getStatusBadgeClass = (status: InsightStatus): string => {
  const classes: Record<string, string> = {
    'BULLISH': 'badge-bullish',
    'BEARISH': 'badge-bearish',
    'NEUTRAL': 'badge-neutral',
    'FEAR': 'border-accent-warning text-accent-warning',
    'EXTREME_FEAR': 'border-status-bearish text-status-bearish',
    'GREED': 'border-accent-primary text-accent-primary',
    'EXTREME_GREED': 'border-accent-primary text-accent-primary',
    'ELEVATED': 'border-accent-warning text-accent-warning',
    'MODERATE': 'badge-neutral',
    'HIGH': 'border-status-bearish text-status-bearish',
    'LOW': 'border-accent-secondary text-accent-secondary',
    'EMERGING': 'border-accent-secondary text-accent-secondary',
  };
  return classes[status] || 'badge-neutral';
};

const getStatusLabel = (status: InsightStatus): string => {
  const labels: Record<string, string> = {
    'BULLISH': 'Bullish',
    'BEARISH': 'Bearish',
    'NEUTRAL': 'Netral',
    'FEAR': 'Ketakutan',
    'EXTREME_FEAR': 'Ketakutan Ekstrem',
    'GREED': 'Keserakahan',
    'EXTREME_GREED': 'Keserakahan Ekstrem',
    'ELEVATED': 'Meningkat',
    'MODERATE': 'Moderat',
    'HIGH': 'Tinggi',
    'LOW': 'Rendah',
    'EMERGING': 'Emerging',
  };
  return labels[status] || status;
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    'MARKET_TREND': <TrendingUp className="w-5 h-5" />,
    'SENTIMENT': <Activity className="w-5 h-5" />,
    'RISK_ASSESSMENT': <AlertTriangle className="w-5 h-5" />,
    'EMERGING_NARRATIVE': <Sparkles className="w-5 h-5" />,
    'OPPORTUNITY': <Target className="w-5 h-5" />,
  };
  return icons[type] || <Activity className="w-5 h-5" />;
};

export default function InsightCard({ insight, onClick }: InsightCardProps) {
  const dataEntries = Object.entries(insight.data_points || {}).filter(
    ([key]) => !['trend_direction'].includes(key)
  );

  return (
    <div 
      className="card-base cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-sm ${
            insight.status === 'BULLISH' || insight.status === 'GREED' || insight.status === 'EXTREME_GREED'
              ? 'bg-status-bullish/10 text-status-bullish'
              : insight.status === 'BEARISH' || insight.status === 'FEAR' || insight.status === 'EXTREME_FEAR'
              ? 'bg-status-bearish/10 text-status-bearish'
              : 'bg-text-muted/10 text-text-muted'
          }`}>
            {getTypeIcon(insight.type)}
          </div>
          <h3 className="text-h3 text-text-primary group-hover:text-accent-primary transition-colors">
            {insight.title}
          </h3>
        </div>
        <span className={`px-2 py-1 text-xs uppercase font-medium rounded-sm border ${getStatusBadgeClass(insight.status)}`}>
          {getStatusLabel(insight.status)}
        </span>
      </div>

      {/* Data Points */}
      <div className="space-y-3 mb-4">
        {dataEntries.slice(0, 4).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-small text-text-secondary capitalize">
              {key.replace(/_/g, ' ')}
            </span>
            <span className={`text-data font-medium ${
              typeof value === 'string' && value.includes('+') ? 'text-status-bullish' :
              typeof value === 'string' && value.includes('-') ? 'text-status-bearish' :
              'text-text-primary'
            }`}>
              {Array.isArray(value) ? value.join(', ') : value}
            </span>
          </div>
        ))}
      </div>

      {/* Reason Block */}
      <div className="reason-block mb-4">
        <span className="text-small text-text-primary">
          {insight.reason}
        </span>
      </div>

      {/* Action & Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-accent-primary/10">
        {insight.action ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-accent-primary uppercase tracking-wider">Action:</span>
            <span className="text-small text-text-secondary">{insight.action}</span>
          </div>
        ) : (
          <span className="text-xs text-text-muted">No action required</span>
        )}
        
        {/* Confidence Score */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Confidence</span>
          <div className="flex items-center gap-1">
            <div className="w-12 h-1.5 bg-bg-base rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  insight.confidence_score >= 70 ? 'bg-status-bullish' :
                  insight.confidence_score >= 40 ? 'bg-accent-warning' :
                  'bg-status-bearish'
                }`}
                style={{ width: `${insight.confidence_score}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${
              insight.confidence_score >= 70 ? 'text-status-bullish' :
              insight.confidence_score >= 40 ? 'text-accent-warning' :
              'text-status-bearish'
            }`}>
              {insight.confidence_score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
