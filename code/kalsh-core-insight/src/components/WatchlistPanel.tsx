import React, { useState } from 'react';
import { X, Trash2, Edit3, Plus, Search, Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { WatchlistItem } from '@/types';

interface WatchlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  loading: boolean;
  onRemove: (id: string) => void;
  onAdd: (symbol: string, name: string) => void;
}

const popularTokens = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'ADA', name: 'Cardano' },
];

export default function WatchlistPanel({ 
  isOpen, 
  onClose, 
  watchlist, 
  loading,
  onRemove,
  onAdd 
}: WatchlistPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

  if (!isOpen) return null;

  const filteredWatchlist = watchlist.filter(item =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableToAdd = popularTokens.filter(
    token => !watchlist.some(item => item.symbol === token.symbol)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md h-full bg-bg-surface border-l border-accent-primary/20 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-bg-surface border-b border-accent-primary/20 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent-warning" />
              <h2 className="text-h3 text-text-primary">Watchlist</h2>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari token..."
              className="w-full h-10 pl-10 pr-4 bg-bg-base border border-accent-primary/20 rounded-sm
                       text-text-primary placeholder:text-text-muted text-small
                       focus:outline-none focus:border-accent-primary"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-text-muted">Loading...</div>
            </div>
          ) : (
            <>
              {/* Watchlist Items */}
              {filteredWatchlist.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {filteredWatchlist.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-bg-base rounded-sm
                               border border-accent-primary/10 hover:border-accent-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center
                                      text-accent-primary text-xs font-bold">
                          {item.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-small font-medium text-text-primary">{item.symbol}</div>
                          <div className="text-xs text-text-muted">{item.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.notes && (
                          <span className="text-[10px] text-text-muted px-2 py-0.5 bg-bg-surface rounded">
                            {item.notes.slice(0, 15)}...
                          </span>
                        )}
                        <button
                          onClick={() => onRemove(item.id)}
                          className="p-1.5 text-text-muted hover:text-accent-danger transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-6">
                  <Star className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                  <p className="text-text-muted text-small">
                    {searchQuery ? 'Tidak ditemukan' : 'Watchlist kosong'}
                  </p>
                </div>
              )}

              {/* Add Section Toggle */}
              <button
                onClick={() => setShowAddSection(!showAddSection)}
                className="w-full flex items-center justify-center gap-2 py-3 
                         border border-dashed border-accent-primary/30 rounded-sm
                         text-accent-primary text-small hover:bg-accent-primary/5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Token ke Watchlist
              </button>

              {/* Popular Tokens to Add */}
              {showAddSection && availableToAdd.length > 0 && (
                <div className="mt-4 p-4 bg-bg-base rounded-sm border border-accent-primary/10">
                  <h3 className="text-xs text-text-muted uppercase tracking-wider mb-3">
                    Token Populer
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableToAdd.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => onAdd(token.symbol, token.name)}
                        className="px-3 py-1.5 bg-bg-surface border border-accent-primary/20 rounded-sm
                                 text-small text-text-secondary hover:text-accent-primary 
                                 hover:border-accent-primary transition-colors"
                      >
                        {token.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
