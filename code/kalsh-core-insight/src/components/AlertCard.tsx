import React from 'react';
import { 
  Wallet, 
  BarChart3, 
  MessageCircle, 
  Flame,
  Eye,
  Bookmark,
  BookmarkCheck,
  X,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';
import type { Alert, AlertUrgency } from '@/types';

interface AlertCardProps {
  alert: Alert;
  onDismiss?: () => void;
  onAddToWatchlist?: () => void;
  onSave?: () => void;
  onViewDetails?: () => void;
  isInWatchlist?: boolean;
  isSaved?: boolean;
}

const getUrgencyClass = (urgency: AlertUrgency): string => {
  const classes: Record<AlertUrgency, string> = {
    'HIGH': 'alert-high',
    'MEDIUM': 'alert-medium',
    'LOW': 'alert-low',
  };
  return classes[urgency];
};

const getUrgencyBadge = (urgency: AlertUrgency): { bg: string; text: string; glow: string; label: string } => {
  const badges: Record<AlertUrgency, { bg: string; text: string; glow: string; label: string }> = {
    'HIGH': { bg: 'bg-alert-high/20', text: 'text-alert-high', glow: 'shadow-glow-danger', label: 'TINGGI' },
    'MEDIUM': { bg: 'bg-alert-medium/20', text: 'text-alert-medium', glow: 'shadow-glow-warning', label: 'SEDANG' },
    'LOW': { bg: 'bg-alert-low/20', text: 'text-alert-low', glow: 'shadow-glow-cyan', label: 'RENDAH' },
  };
  return badges[urgency];
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    'WHALE_MOVEMENT': <Wallet className="w-5 h-5" />,
    'VOLUME_SPIKE': <BarChart3 className="w-5 h-5" />,
    'SENTIMENT_SHIFT': <MessageCircle className="w-5 h-5" />,
    'NARRATIVE_MOMENTUM': <Flame className="w-5 h-5" />,
  };
  return icons[type] || <BarChart3 className="w-5 h-5" />;
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function AlertCard({ 
  alert, 
  onDismiss, 
  onAddToWatchlist, 
  onSave,
  onViewDetails,
  isInWatchlist = false,
  isSaved = false
}: AlertCardProps) {
  const urgencyBadge = getUrgencyBadge(alert.urgency);
  const triggerEntries = Object.entries(alert.trigger_info || {}).filter(
    ([key]) => !['signal_score'].includes(key)
  );
  const signalScore = alert.trigger_info?.signal_score as number | undefined;

  return (
    <div className={`card-base ${getUrgencyClass(alert.urgency)} animate-slide-in-right group`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-sm ${urgencyBadge.bg} ${urgencyBadge.text}`}>
            {getTypeIcon(alert.type)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${urgencyBadge.bg} ${urgencyBadge.text}`}>
                {urgencyBadge.label}
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-bg-base text-accent-primary border border-accent-primary/30">
                {alert.symbol}
              </span>
              {isInWatchlist && (
                <span className="text-[10px] text-accent-secondary">
                  <Zap className="w-3 h-3 inline" /> Watched
                </span>
              )}
            </div>
            <h3 className="text-body font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
              {alert.title}
            </h3>
          </div>
        </div>
        
        {/* Timestamp & Score */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(alert.created_at)}
          </div>
          {signalScore && (
            <div className="flex items-center gap-1">
              <TrendingUp className={`w-3 h-3 ${
                signalScore >= 70 ? 'text-status-bullish' :
                signalScore >= 50 ? 'text-accent-warning' :
                'text-text-muted'
              }`} />
              <span className={`text-xs font-bold ${
                signalScore >= 70 ? 'text-status-bullish' :
                signalScore >= 50 ? 'text-accent-warning' :
                'text-text-muted'
              }`}>
                {signalScore}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Trigger Info */}
      <div className="space-y-2 mb-4 p-3 bg-bg-base rounded-sm">
        {triggerEntries.slice(0, 5).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-xs text-text-muted capitalize">
              {key.replace(/_/g, ' ')}
            </span>
            <span className={`text-small font-mono font-medium ${
              String(value).includes('+') ? 'text-status-bullish' :
              String(value).includes('-') && !String(value).includes('$') ? 'text-status-bearish' :
              'text-accent-primary'
            }`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Context */}
      {alert.context && Object.keys(alert.context).length > 0 && (
        <div className="mb-4 space-y-1">
          {Object.entries(alert.context).slice(0, 3).map(([key, value]) => (
            <p key={key} className="text-small text-text-secondary">
              <span className="text-text-muted capitalize">{key.replace(/_/g, ' ')}: </span>
              {value}
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-accent-primary/10">
        <button 
          onClick={onViewDetails}
          className="btn-ghost flex items-center gap-1 text-accent-primary"
        >
          <Eye className="w-3 h-3" />
          <span className="text-xs">Detail</span>
        </button>
        <button 
          onClick={onAddToWatchlist}
          className={`btn-ghost flex items-center gap-1 ${
            isInWatchlist ? 'text-accent-secondary' : ''
          }`}
        >
          <Bookmark className={`w-3 h-3 ${isInWatchlist ? 'fill-current' : ''}`} />
          <span className="text-xs">{isInWatchlist ? 'Watching' : 'Watch'}</span>
        </button>
        <button 
          onClick={onSave}
          className={`btn-ghost flex items-center gap-1 ${
            isSaved ? 'text-accent-warning' : ''
          }`}
        >
          {isSaved ? (
            <BookmarkCheck className="w-3 h-3 fill-current" />
          ) : (
            <BookmarkCheck className="w-3 h-3" />
          )}
          <span className="text-xs">{isSaved ? 'Saved' : 'Save'}</span>
        </button>
        <div className="flex-1" />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className="btn-ghost text-text-muted hover:text-accent-danger"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
