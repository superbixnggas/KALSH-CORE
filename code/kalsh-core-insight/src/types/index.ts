// Market Stats Types
export interface MarketStats {
  id?: string;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'SLIGHTLY_BULLISH' | 'SLIGHTLY_BEARISH';
  btc_dominance: number;
  fear_greed_index: number;
  active_narratives: number;
  total_market_cap: number;
  volume_24h: number;
  btc_price: number;
  eth_price: number;
  btc_change_24h?: number;
  eth_change_24h?: number;
  data_timestamp: string;
  updated_at?: string;
}

// Insight Types
export type InsightType = 'MARKET_TREND' | 'SENTIMENT' | 'RISK_ASSESSMENT' | 'EMERGING_NARRATIVE' | 'OPPORTUNITY';
export type InsightMode = 'daily' | 'live' | 'explorer' | 'all';
export type InsightStatus = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'FEAR' | 'EXTREME_FEAR' | 'GREED' | 'EXTREME_GREED' | 'ELEVATED' | 'MODERATE' | 'HIGH' | 'LOW' | 'EMERGING';

export interface Insight {
  id: string;
  type: InsightType;
  mode: InsightMode;
  title: string;
  status: InsightStatus;
  data_points: Record<string, string | number | string[]>;
  reason: string;
  action: string | null;
  confidence_score: number;
  narrative_category: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

// Alert Types
export type AlertType = 'WHALE_MOVEMENT' | 'VOLUME_SPIKE' | 'SENTIMENT_SHIFT' | 'NARRATIVE_MOMENTUM';
export type AlertUrgency = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Alert {
  id: string;
  type: AlertType;
  urgency: AlertUrgency;
  title: string;
  trigger_info: Record<string, string | number>;
  context: Record<string, string>;
  symbol: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

// User Types
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_mode: InsightMode;
  notification_enabled: boolean;
  alert_urgency_filter: AlertUrgency[];
  preferred_narratives?: string[];
  timezone: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  category?: string;
  added_at: string;
  notes?: string;
}

// Dashboard Mode
export type DashboardMode = 'daily' | 'live' | 'explorer';
