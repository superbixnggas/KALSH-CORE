import React, { useState } from 'react';
import { 
  Activity, 
  Menu, 
  X, 
  Zap,
  Compass,
  BarChart2,
  Wifi,
  WifiOff,
  LogIn,
  LogOut,
  User,
  Star,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { DashboardMode } from '@/types';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentMode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
  isConnected: boolean;
  lastSync: Date | null;
  newAlertCount?: number;
  onWatchlistClick?: () => void;
  watchlistCount?: number;
}

const modes: { id: DashboardMode; label: string; icon: React.ReactNode }[] = [
  { id: 'daily', label: 'Daily Insight', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'live', label: 'Live Alerts', icon: <Zap className="w-4 h-4" /> },
  { id: 'explorer', label: 'Explorer', icon: <Compass className="w-4 h-4" /> },
];

export default function Header({ currentMode, onModeChange, isConnected, lastSync, newAlertCount = 0, onWatchlistClick, watchlistCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const formatLastSync = (date: Date | null) => {
    if (!date) return '--';
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg-pure border-b border-accent-primary/20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-accent-primary" />
              <span className="text-h3 font-bold text-accent-primary tracking-tight">
                KALSH
              </span>
              <span className="terminal-cursor hidden sm:inline-block" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onModeChange(mode.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-small font-medium
                    transition-all duration-fast
                    ${currentMode === mode.id
                      ? 'text-text-primary border-b-2 border-accent-primary'
                      : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              ))}
            </nav>

            {/* Status Area */}
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-accent-primary" />
                ) : (
                  <WifiOff className="w-4 h-4 text-accent-danger" />
                )}
                <span className="hidden lg:inline">
                  {formatLastSync(lastSync)}
                </span>
              </div>

              {/* Watchlist Button */}
              {user && onWatchlistClick && (
                <button
                  onClick={onWatchlistClick}
                  className="relative p-2 text-text-muted hover:text-accent-secondary transition-colors"
                  title="Watchlist"
                >
                  <Star className="w-4 h-4" />
                  {watchlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-accent-secondary text-bg-pure rounded-full flex items-center justify-center">
                      {watchlistCount}
                    </span>
                  )}
                </button>
              )}

              {/* New Alerts Badge */}
              {newAlertCount > 0 && currentMode !== 'live' && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-accent-danger/20 border border-accent-danger/30 rounded-sm">
                  <Bell className="w-3 h-3 text-accent-danger animate-pulse" />
                  <span className="text-xs text-accent-danger">{newAlertCount} baru</span>
                </div>
              )}

              {/* Auth Button */}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-xs text-text-secondary">
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-text-muted hover:text-accent-danger transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs border border-accent-primary/30 
                           text-accent-primary hover:bg-accent-primary/10 rounded-sm transition-colors"
                >
                  <LogIn className="w-3 h-3" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-accent-primary/10">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onModeChange(mode.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-small whitespace-nowrap
                      rounded-sm transition-all duration-fast
                      ${currentMode === mode.id
                        ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary'
                        : 'text-text-secondary border border-transparent'
                      }
                    `}
                  >
                    {mode.icon}
                    {mode.label}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
