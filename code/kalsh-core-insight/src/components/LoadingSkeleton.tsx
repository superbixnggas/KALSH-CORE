import React from 'react';

export function CardSkeleton() {
  return (
    <div className="card-base animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-bg-hover" />
          <div className="h-5 w-32 rounded bg-bg-hover" />
        </div>
        <div className="h-6 w-16 rounded bg-bg-hover" />
      </div>

      {/* Data Points */}
      <div className="space-y-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 w-24 rounded bg-bg-hover" />
            <div className="h-4 w-16 rounded bg-bg-hover" />
          </div>
        ))}
      </div>

      {/* Reason Block */}
      <div className="bg-bg-base p-3 rounded-sm mb-4">
        <div className="h-4 w-full rounded bg-bg-hover mb-2" />
        <div className="h-4 w-3/4 rounded bg-bg-hover" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-accent-primary/10">
        <div className="h-4 w-32 rounded bg-bg-hover" />
        <div className="h-4 w-16 rounded bg-bg-hover" />
      </div>
    </div>
  );
}

export function AlertSkeleton() {
  return (
    <div className="card-base border-t-[3px] border-t-bg-hover animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-bg-hover" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-12 rounded bg-bg-hover" />
              <div className="h-4 w-8 rounded bg-bg-hover" />
            </div>
            <div className="h-5 w-40 rounded bg-bg-hover" />
          </div>
        </div>
        <div className="h-4 w-16 rounded bg-bg-hover" />
      </div>

      {/* Trigger Info */}
      <div className="p-3 bg-bg-base rounded-sm mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center mb-2 last:mb-0">
            <div className="h-3 w-20 rounded bg-bg-hover" />
            <div className="h-3 w-24 rounded bg-bg-hover" />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-accent-primary/10">
        <div className="h-8 w-16 rounded bg-bg-hover" />
        <div className="h-8 w-16 rounded bg-bg-hover" />
        <div className="flex-1" />
        <div className="h-8 w-8 rounded bg-bg-hover" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, type = 'card' }: { count?: number; type?: 'card' | 'alert' }) {
  const Skeleton = type === 'alert' ? AlertSkeleton : CardSkeleton;
  
  return (
    <div className="insight-grid">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}
