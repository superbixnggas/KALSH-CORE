import React from 'react';
import { Clock, Activity, ExternalLink } from 'lucide-react';

interface FooterProps {
  lastUpdate: Date | null;
  isConnected: boolean;
}

export default function Footer({ lastUpdate, isConnected }: FooterProps) {
  const formatTime = (date: Date | null): string => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <footer className="bg-bg-pure border-t border-accent-primary/10 py-4">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Data Freshness */}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Last updated: {formatTime(lastUpdate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-status-bullish animate-pulse' : 'bg-status-bearish'
              }`} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>

          {/* Attribution & Links */}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>Data by CoinGecko</span>
            <span className="text-accent-primary/50">|</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-accent-primary" />
              <span className="font-medium text-text-secondary">Powered by Kalsh</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-accent-primary/5 text-center">
          <p className="text-[10px] text-text-muted max-w-2xl mx-auto">
            Disclaimer: Konten ini bukan merupakan saran finansial. 
            Selalu lakukan riset mandiri sebelum mengambil keputusan investasi.
          </p>
        </div>
      </div>
    </footer>
  );
}
