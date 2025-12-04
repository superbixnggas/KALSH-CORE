import React from 'react';
import { Sparkles, TrendingUp, Plus, ChevronRight } from 'lucide-react';
import type { Insight } from '@/types';

interface ExplorerCardProps {
  insight: Insight;
  onClick?: () => void;
  onAddToWatch?: () => void;
}

export default function ExplorerCard({ insight, onClick, onAddToWatch }: ExplorerCardProps) {
  const dataEntries = Object.entries(insight.data_points || {});
  const socialMomentum = insight.data_points?.social_momentum as string | undefined;
  const score = insight.data_points?.score as number | undefined;

  // Parse momentum for progress bar
  const getMomentumValue = (): number => {
    if (!socialMomentum) return 50;
    const match = socialMomentum.match(/\+?(\d+)/);
    return match ? Math.min(parseInt(match[1]), 100) : 50;
  };

  return (
    <div 
      className="card-base cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      {/* NEW Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-2 py-1 bg-accent-secondary text-black text-[10px] font-bold uppercase rounded-sm">
          NEW
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4 pr-12">
        <div className="p-2 rounded-sm bg-accent-secondary/10 text-accent-secondary">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-h3 text-text-primary group-hover:text-accent-secondary transition-colors">
            {insight.title}
          </h3>
          <span className="text-xs text-text-muted capitalize">
            {insight.narrative_category}
          </span>
        </div>
      </div>

      {/* Momentum Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-text-muted uppercase tracking-wider">Social Momentum</span>
          <span className="text-small text-accent-primary font-medium">
            {socialMomentum || '+0%'}
          </span>
        </div>
        <div className="h-1 bg-bg-base rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-slow"
            style={{ width: `${getMomentumValue()}%` }}
          />
        </div>
      </div>

      {/* Data Points */}
      <div className="space-y-2 mb-4">
        {dataEntries
          .filter(([key]) => !['social_momentum'].includes(key))
          .slice(0, 3)
          .map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
              <span className="text-small text-text-secondary capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-small text-text-primary font-medium">
                {String(value)}
              </span>
            </div>
          ))}
      </div>

      {/* Reason */}
      <div className="reason-block mb-4">
        <span className="text-small text-text-primary">
          {insight.reason}
        </span>
      </div>

      {/* Confidence Score */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-text-muted uppercase tracking-wider">Confidence Score</span>
        <div className="flex items-center gap-2">
          <span className={`text-h2 font-bold ${
            insight.confidence_score >= 70 ? 'text-status-bullish' :
            insight.confidence_score >= 40 ? 'text-accent-warning' :
            'text-status-bearish'
          }`}>
            {insight.confidence_score}
          </span>
          <span className="text-small text-text-muted">/100</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-accent-primary/10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToWatch?.();
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 
                   bg-accent-secondary/10 text-accent-secondary 
                   hover:bg-accent-secondary hover:text-black
                   text-small font-medium rounded-sm transition-all duration-fast"
        >
          <Plus className="w-4 h-4" />
          Add to Watch
        </button>
        <button 
          className="flex items-center justify-center p-2
                   text-text-muted hover:text-accent-primary
                   transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
