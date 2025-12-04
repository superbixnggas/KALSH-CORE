# Content Structure Plan - Kalsh Core Insight

## 1. Material Inventory

**Content Files:**
- `extract/KALSH CORE INSIGHT_24e6ebc9.json` (~800 words, sections: Overview, Core Concept, Features, Output Structure, Target Users, Design Principles, Roadmap)

**Research Materials:**
- `docs/crypto_apis/crypto_realtime_apis_analysis.md` (API stack recommendations)
- `docs/social_data/social_sentiment_sources_analysis.md` (Social data sources)
- `docs/developer_data/developer_activity_sources_analysis.md` (Dev tracking methods)
- `docs/narrative_tracking/narrative_detection_methods_analysis.md` (Narrative momentum detection)

**Visual Assets:**
- `imgs/` (empty - decorative images handled in design spec)

**Data Files:**
- None provided (mock data patterns specified in design)

## 2. Website Structure

**Type:** SPA (Single Page Application)

**Reasoning:** 
- Single dashboard interface dengan 3 mode view (Daily, Live, Explorer)
- <2000 words content aktual yang ditampilkan per session
- Single goal: deliver actionable crypto insights
- Tab-based navigation, tidak memerlukan halaman terpisah
- Real-time updates dalam satu viewport

## 3. Section Breakdown

### Dashboard SPA Layout

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| **Header Navigation** | Terminal Header | - | Logo "KALSH", navigation tabs, wallet status | - |
| **Mode Selector** | Tab Navigation | - | 3 tabs: Daily Insight, Live Alerts, Explorer | - |
| **Stats Bar** | Network Stats Row | Real-time API | Market trend, BTC dominance, fear/greed index, active narratives count | - |
| **Filter Bar** | Horizontal Filter | - | Timeframe, narrative category, urgency level, sort options | - |
| **Insight Cards Grid** | Card Grid (3-col → 1-col) | API + Processing | Variable based on mode (see below) | - |
| **Footer** | Minimal Footer | - | Data freshness timestamp, attribution | - |

### Mode 1: Daily Insight Cards

| Card Section | Component Pattern | Content Structure | Visual Treatment |
|--------------|------------------|-------------------|------------------|
| **Card Header** | Title + Status Badge | Insight type + Status (Bullish/Bearish/Neutral) | Terminal green/red/gray |
| **Data Points** | Data List | 3-5 key metrics with labels | Monospace, accent colors |
| **Reason Block** | Text Block | 1-2 sentence explanation | Regular text with terminal styling |
| **Action (Optional)** | Action Chip | Suggested action (Entry/Exit/Hold/Watch) | Outlined chip with glow |

**Example Daily Cards:**
1. Market Trend Card (overall market direction)
2. Narrative Spotlight Card (top 3 active narratives)
3. Risk Assessment Card (market risk level)
4. Recommendation Card (action suggestions)

### Mode 2: Live Alerts Cards

| Card Section | Component Pattern | Content Structure | Visual Treatment |
|--------------|------------------|-------------------|------------------|
| **Alert Header** | Urgency Badge + Title | HIGH/MEDIUM/LOW + Alert type | Color-coded urgency |
| **Trigger Info** | Data Display | What triggered alert (whale entry, volume spike, etc.) | Highlighted data |
| **Context** | Mini Data Row | Related metrics | Secondary styling |
| **Timestamp** | Time Ago | Relative time (2m ago, 1h ago) | Muted monospace |
| **Quick Action** | Button Group | View Details, Add to Watchlist, Dismiss | Ghost buttons |

**Alert Types:**
1. Whale Entry Alert (large wallet movement)
2. Volume Spike Alert (unusual trading volume)
3. Sentiment Shift Alert (rapid sentiment change)
4. Narrative Momentum Alert (emerging narrative acceleration)

### Mode 3: Explorer Insight Cards

| Card Section | Component Pattern | Content Structure | Visual Treatment |
|--------------|------------------|-------------------|------------------|
| **Discovery Header** | Title + New Badge | Narrative name + "NEW" indicator | Cyan accent for new |
| **Momentum Metrics** | Progress Bar + Stats | Social velocity, search interest, whale activity | Visual progress bars |
| **Evidence List** | Bullet List | 3-4 supporting data points | Monospace bullets |
| **Confidence Score** | Score Display | 0-100 confidence rating | Circular progress or bar |
| **Explore CTA** | Primary Button | "Deep Dive" or "Add to Watch" | Terminal button style |

**Explorer Categories:**
1. Emerging Narrative Cards (new narratives gaining momentum)
2. Early Signal Cards (pre-mainstream opportunities)
3. Cross-Signal Cards (confluence of multiple indicators)

## 4. Content Analysis

**Information Density:** High
- Real-time data streams
- Multiple concurrent insight cards
- Dense metrics per card
- Requires compact terminal-style layout

**Content Balance:**
- Images: 0 (0%) - No decorative images, data-focused
- Data/Charts: 80% - Primary content type
- Text: 20% - Explanations and reasons

**Content Type:** Data-driven dashboard

## 5. Interaction Patterns

| Interaction | Trigger | Response |
|-------------|---------|----------|
| Mode Switch | Tab click | Cards transition, URL hash update |
| Card Expand | Card click | Modal with full insight details |
| Filter Change | Filter selection | Cards filter/sort with animation |
| Real-time Update | WebSocket event | Card glow pulse, data update |
| Copy Hash/Address | Click copy icon | Copy to clipboard, toast confirmation |
| Alert Dismiss | Dismiss button | Card fade out, persist preference |

## 6. Real-time Data Requirements

| Data Type | Update Frequency | Display Pattern |
|-----------|-----------------|-----------------|
| Market Stats | 30s - 1min | Number counter animation |
| Daily Insights | Once daily (scheduled) | Static until refresh |
| Live Alerts | Real-time (WebSocket) | Push notification + card injection |
| Explorer Insights | 15min - 1hr | Batch refresh with indicator |
| Narrative Scores | 5min | Progress bar update |

## 7. Mobile Considerations

| Desktop | Mobile Adaptation |
|---------|------------------|
| 3-column card grid | 1-column stack |
| Horizontal filter bar | Collapsible filter drawer |
| Side-by-side stats | Horizontal scroll stats |
| Hover card effects | Tap to expand |
| Full address display | Truncated (4+4 chars) |
