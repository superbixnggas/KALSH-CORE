# Design Specification - Kalsh Core Insight

**Style:** Web3 Decentralized | **Version:** 1.0 | **Platform:** SPA Dashboard

---

## 1. Direction & Rationale

**Design Essence:** Terminal-inspired crypto intelligence dashboard dengan blockchain aesthetics. Pure black backgrounds, matrix green/cyan accents, monospace typography untuk data, dan sharp angular UI elements yang mencerminkan trustless & transparent nature dari Web3.

**Visual Identity:** Kalsh Core Insight tampil sebagai "command center" untuk crypto intelligence - profesional namun crypto-native, data-dense namun readable, technical namun accessible untuk target audience (crypto traders 20-40).

**Reference Sites:**
- Dune Analytics (data dashboard aesthetic)
- Etherscan (blockchain data display)
- Linear.app dark mode (clean terminal feel)

---

## 2. Design Tokens

### 2.1 Color Palette

**Backgrounds (85% Dark Terminal)**

| Token | Value | Usage |
|-------|-------|-------|
| `bg-pure` | #000000 | Page background |
| `bg-base` | #0a0a0a | Primary surface |
| `bg-surface` | #141414 | Cards, elevated elements |
| `bg-elevated` | #1a1a1a | Modals, dropdowns |
| `bg-hover` | #1f1f1f | Interactive hover states |

**Text (10% High Contrast)**

| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | #e5e5e5 | Primary body text |
| `text-secondary` | #a3a3a3 | Secondary, labels |
| `text-muted` | #71717a | Timestamps, hints |
| `text-emphasis` | #ffffff | Rare emphasis |

**Accent Colors (5% Terminal)**

| Token | Value | Usage |
|-------|-------|-------|
| `accent-primary` | #00ff41 | Matrix green - primary actions, success |
| `accent-secondary` | #00ffff | Cyan - links, new items, info |
| `accent-warning` | #ffb700 | Amber - pending, warnings |
| `accent-danger` | #ff5757 | Red - errors, bearish |
| `accent-glow-green` | rgba(0,255,65,0.5) | Green glow effects |
| `accent-glow-cyan` | rgba(0,255,255,0.5) | Cyan glow effects |

**Semantic Colors**

| Token | Value | Usage |
|-------|-------|-------|
| `status-bullish` | #00ff41 | Positive trends, gains |
| `status-bearish` | #ff5757 | Negative trends, losses |
| `status-neutral` | #a3a3a3 | Neutral state |
| `alert-high` | #ff5757 | High urgency alerts |
| `alert-medium` | #ffb700 | Medium urgency |
| `alert-low` | #00ffff | Low urgency, info |

**WCAG Verification:**
- `text-primary` (#e5e5e5) on `bg-base` (#0a0a0a): 14.7:1 AAA
- `accent-primary` (#00ff41) on `bg-base`: 12.3:1 AAA
- `accent-secondary` (#00ffff) on `bg-base`: 13.9:1 AAA

### 2.2 Typography

**Font Families**

| Token | Value | Usage |
|-------|-------|-------|
| `font-mono` | 'JetBrains Mono', 'Fira Code', monospace | 80% - Data, addresses, UI |
| `font-sans` | 'Inter', 'SF Pro', sans-serif | 20% - Large headlines only |

**Type Scale**

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-hero` | 48px | 700 | 1.2 | Hero headlines |
| `text-h1` | 32px | 700 | 1.3 | Section headers |
| `text-h2` | 24px | 600 | 1.4 | Card titles |
| `text-h3` | 20px | 500 | 1.4 | Subsection headers |
| `text-data-lg` | 20px | 700 | 1.5 | Large data values |
| `text-body` | 16px | 400 | 1.6 | Body text |
| `text-data` | 16px | 500 | 1.5 | Data values |
| `text-small` | 14px | 400 | 1.5 | Metadata, timestamps |
| `text-xs` | 12px | 400 | 1.4 | Badges, labels |

**Letter Spacing**
- Headlines: -0.01em
- Monospace data: 0.02em (breathing room)
- Uppercase labels: 0.05em

### 2.3 Spacing (8pt Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inline, badges |
| `space-2` | 8px | Tight gaps |
| `space-3` | 12px | Small padding |
| `space-4` | 16px | Standard gaps |
| `space-5` | 20px | Medium padding |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-10` | 40px | Large spacing |
| `space-12` | 48px | Section margins |
| `space-16` | 64px | Hero padding |

### 2.4 Border Radius (Sharp Terminal)

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Tables, terminal blocks |
| `radius-sm` | 4px | Buttons, inputs, badges |
| `radius-md` | 8px | Cards, modals |
| `radius-full` | 9999px | Pills, circular nodes |

### 2.5 Shadows & Glows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | none | Default (terminal is flat) |
| `glow-green` | 0 0 10px rgba(0,255,65,0.3) | Active states |
| `glow-green-lg` | 0 0 20px rgba(0,255,65,0.4) | Emphasis |
| `glow-cyan` | 0 0 10px rgba(0,255,255,0.3) | Info/new items |
| `glow-warning` | 0 0 10px rgba(255,183,0,0.3) | Warning states |
| `glow-danger` | 0 0 10px rgba(255,87,87,0.3) | Alert/error |

### 2.6 Animation

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 150ms | Hover, micro-interactions |
| `duration-normal` | 250ms | Standard transitions |
| `duration-slow` | 400ms | Modals, complex animations |
| `easing-sharp` | cubic-bezier(0.4,0,1,1) | Technical transitions |
| `easing-linear` | linear | Data updates, counters |

---

## 3. Component Specifications

### 3.1 Navigation Header

**Structure:**
- Height: 64px
- Background: `bg-pure` (#000000)
- Border-bottom: 1px solid rgba(0,255,65,0.2)
- Container max-width: 1400px, centered

**Elements:**
- **Logo (Left):** "KALSH" in monospace bold, accent-primary color, optional terminal cursor blink
- **Mode Tabs (Center):** 3 tabs - Daily Insight | Live Alerts | Explorer
  - Inactive: text-secondary, no background
  - Active: text-primary, border-bottom 2px accent-primary, subtle glow
  - Hover: text-primary
- **Status Area (Right):** Network status indicator (green dot), last sync timestamp

**Mobile:** Logo left, hamburger menu right, tabs move to horizontal scroll below header

### 3.2 Stats Bar

**Structure:**
- Height: auto (padding 16px vertical)
- Background: `bg-surface` (#141414)
- Border: 1px solid rgba(0,255,65,0.15)
- Layout: 4-column grid (1-col on mobile, horizontal scroll)

**Stat Item:**
- Label: text-xs, text-muted, uppercase, letter-spacing 0.05em
- Value: text-data-lg (20px), text-primary or status color
- Change indicator: text-small with directional icon
- Spacing: 24px padding internal

**Stats to Display:**
1. Market Trend (Bullish/Bearish/Neutral)
2. BTC Dominance (percentage)
3. Fear & Greed (0-100 with label)
4. Active Narratives (count)

### 3.3 Insight Cards (Core Component)

**Base Card Structure:**
- Background: `bg-surface` (#141414)
- Border: 1px solid rgba(0,255,65,0.2)
- Border-radius: 8px
- Padding: 24px
- Hover: border-color accent-primary, glow-green

**Card Header:**
- Title: text-h2 (24px), text-primary
- Status Badge: text-xs, uppercase, padding 4px 8px, radius-sm
  - Bullish: bg transparent, border status-bullish, text status-bullish
  - Bearish: bg transparent, border status-bearish, text status-bearish
  - Neutral: bg transparent, border text-muted, text text-muted

**Data Section:**
- Layout: Vertical stack, gap 12px
- Data Row: Label (text-small, text-muted) + Value (text-data, accent or primary)
- Visual: Optional mini sparkline or progress bar

**Reason Block:**
- Prefix: ">" terminal prompt in accent-primary
- Text: text-body, text-primary
- Background: bg-base (#0a0a0a), padding 12px, radius-sm

**Action Chip (Optional):**
- Style: Outlined pill
- Text: text-small, uppercase, monospace
- Border: 1px solid accent-primary
- Padding: 8px 16px
- Hover: filled background accent-primary, text black

### 3.4 Live Alert Card (Variant)

**Additional Elements:**
- Urgency Header Bar: Full-width top strip
  - HIGH: 3px solid alert-high (#ff5757), pulsing glow
  - MEDIUM: 3px solid alert-medium (#ffb700)
  - LOW: 3px solid alert-low (#00ffff)
- Timestamp: Absolute position top-right, text-xs, text-muted
- Quick Actions: Button group at bottom
  - View: Ghost button, accent-primary
  - Watch: Ghost button, text-secondary
  - Dismiss: Ghost button, text-muted

**Animation:** New alerts slide in from right with glow pulse effect (400ms)

### 3.5 Explorer Card (Variant)

**Additional Elements:**
- "NEW" Badge: Position top-right, bg accent-secondary, text black, padding 4px 8px
- Momentum Bar: Full-width progress bar
  - Track: bg-base
  - Fill: gradient from accent-primary to accent-secondary
  - Height: 4px
- Confidence Score: 
  - Display: Large number (text-hero size) with "/100" suffix
  - Color: Conditional (>70 green, 40-70 amber, <40 red)

### 3.6 Filter Bar

**Structure:**
- Background: bg-surface
- Padding: 16px 24px
- Border: 1px solid rgba(0,255,65,0.1)
- Layout: Flex row, gap 16px, wrap on mobile

**Filter Chip:**
- Style: Pill shape, radius-full
- Inactive: bg-base, border text-muted, text-secondary
- Active: border accent-primary, text accent-primary, glow-green
- Size: padding 8px 16px, text-small

**Sort Dropdown:**
- Trigger: Terminal-style with ">" prefix
- Dropdown: bg-elevated, border accent-primary, sharp corners (radius-sm)
- Options: text-body, hover bg-hover

---

## 4. Layout & Responsive

### 4.1 SPA Structure

Based on content-structure-plan.md:

```
┌─────────────────────────────────────────────────────────┐
│ HEADER: Logo | [Daily] [Live] [Explorer] | Status       │ 64px
├─────────────────────────────────────────────────────────┤
│ STATS BAR: Trend | BTC Dom | Fear/Greed | Narratives    │ auto
├─────────────────────────────────────────────────────────┤
│ FILTER BAR: [Timeframe] [Category] [Urgency] [Sort v]   │ auto
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │  Card   │  │  Card   │  │  Card   │                 │ flex
│  │         │  │         │  │         │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │  Card   │  │  Card   │  │  Card   │                 │
│  │         │  │         │  │         │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ FOOTER: Last updated: 2m ago | Powered by Kalsh        │ 48px
└─────────────────────────────────────────────────────────┘
```

### 4.2 Grid System

**Container:**
- Max-width: 1400px
- Padding: 24px (desktop), 16px (mobile)
- Centered

**Card Grid:**
- Desktop (≥1024px): 3 columns, gap 24px
- Tablet (768-1023px): 2 columns, gap 20px
- Mobile (<768px): 1 column, gap 16px

### 4.3 Breakpoints

| Breakpoint | Width | Adaptations |
|------------|-------|-------------|
| `sm` | 640px | Stack cards, simplified stats |
| `md` | 768px | 2-col grid, tabs visible |
| `lg` | 1024px | 3-col grid, full layout |
| `xl` | 1280px | Enhanced spacing |

### 4.4 Mobile Adaptations

**Header:**
- Logo + hamburger (mode tabs in drawer)
- Height: 56px

**Stats Bar:**
- Horizontal scroll with snap points
- Each stat: min-width 140px

**Filter Bar:**
- Collapse to filter icon button
- Opens bottom sheet with all filters

**Cards:**
- Full width, reduced padding (20px)
- Truncate addresses: 4+4 characters (0x1234...abcd)
- Stack data rows if needed

**Touch Targets:**
- Minimum 44x44px for all interactive elements

---

## 5. Interaction & Animation

### 5.1 Animation Standards

**Permitted Animations:**
- Number counters (data updates): linear, 250ms
- Card hover (border + glow): 150ms, sharp easing
- Tab switch (indicator slide): 250ms, sharp easing
- New alert entry (slide + glow pulse): 400ms
- Modal open/close: 250ms, fade + scale(0.95→1)
- Skeleton loading: pulse opacity 0.5→1, 1.5s infinite

**Terminal Effects:**
- Cursor blink on logo: 0.8s infinite step-end
- Data update glow pulse: 2s ease-out (once on change)
- Typing effect for loading states: 50ms per character

### 5.2 State Transitions

**Cards:**
- Default → Hover: border-color change, glow appear (150ms)
- Default → Active/Selected: filled border, stronger glow

**Buttons:**
- Default → Hover: background fill, color invert (150ms)
- Default → Active: scale(0.98), glow intensify

**Alerts (Real-time):**
- Entry: slide from right (translateX 100%→0), opacity 0→1, glow pulse
- Dismiss: fade out (opacity 1→0), height collapse

### 5.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Replace animations with instant state changes for accessibility.

### 5.4 Loading States

**Skeleton Pattern:**
- Background: bg-surface with animated gradient shimmer
- Shimmer: linear-gradient 90deg, transparent→bg-hover→transparent
- Animation: translateX(-100%→100%), 1.5s infinite

**Data Loading:**
- Show "---" or "..." in monospace
- Subtle pulse animation on placeholder

**Real-time Connection:**
- Status indicator: green dot (connected), amber dot (reconnecting), red dot (disconnected)
- Connection status text in footer

---

## Additional Notes

### Icon System
- Library: Lucide Icons atau Heroicons (outline style, 1.5px stroke)
- Size: 20px (UI), 24px (actions), 32px (features)
- Color: Inherit from parent (typically text-secondary or accent)
- Custom icons for: Wallet, Chain, Block, Hash, Alert, Trend arrows

### Data Display Patterns

**Address/Hash:**
```
┌─────────────────────────────────────────┐
│ 0x1234567890abcdef...abcd  [Copy Icon] │
└─────────────────────────────────────────┘
```
- Background: bg-base
- Border: 1px solid accent-primary at 0.2 opacity
- Font: monospace, text-small
- Copy icon: 16px, hover glow

**Percentage Change:**
- Positive: +12.5% with up arrow, status-bullish color
- Negative: -8.3% with down arrow, status-bearish color
- Neutral: 0.0%, text-muted

**Timestamps:**
- Relative: "2m ago", "1h ago", "Yesterday"
- Absolute on hover tooltip: "Dec 5, 2025 02:45:00 UTC"

### Performance Rules
- Animate only `transform` and `opacity` (GPU-accelerated)
- Debounce real-time updates (batch within 100ms window)
- Lazy load cards below fold
- Virtual scroll for >50 cards
