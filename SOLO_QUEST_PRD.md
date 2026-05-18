# SOLO QUEST — Product Requirements Document
**Version:** 1.0.0  
**Status:** Ready for Development  
**Author:** AI Product Design Lead  
**Date:** 2026-05-18

---

## Table of Contents

1. [Product Vision & Problem Statement](#1-product-vision--problem-statement)
2. [User Persona](#2-user-persona)
3. [Feature List (MVP + Future)](#3-feature-list)
4. [Detailed Mechanics Specification](#4-detailed-mechanics-specification)
5. [Screen-by-Screen UX Flow](#5-screen-by-screen-ux-flow)
6. [Tech Stack Recommendation](#6-tech-stack-recommendation)
7. [Data Model / Schema](#7-data-model--schema)
8. [Component Architecture](#8-component-architecture)
9. [Success Metrics](#9-success-metrics)
10. [Visual Design System](#10-visual-design-system)
11. [Edge Cases & Error Handling](#11-edge-cases--error-handling)
12. [Development Roadmap](#12-development-roadmap)

---

## 1. Product Vision & Problem Statement

### Vision Statement

> "Make showing up feel like leveling up."

Solo Quest transforms a single daily commitment into an RPG progression system — not to add pressure, but to make personal growth *visible*, *tangible*, and *compelling*. The app turns the abstract concept of "doing something every day" into a narrative where the user is the protagonist, and every check-in is a battle won.

### Problem Statement

Most habit-tracking apps fail for one of three reasons:

1. **No emotional hook.** Streaks and checkboxes are logically satisfying but emotionally hollow. When the streak breaks, users abandon entirely.
2. **Punishment-first design.** Losing a 47-day streak feels catastrophic. Users stop rather than restart because the loss outweighs the motivation to rebuild.
3. **Too many habits, no focus.** Multi-habit trackers dilute commitment. Users spread thin across 8 habits and build identity around none of them.

Solo Quest addresses all three:
- One quest = deep identity investment
- XP never disappears — progress is permanent even when streaks break
- Rank and title progression creates an ongoing narrative of self-improvement

### Core Philosophy

**Permanence over perfection.** A missed day costs a streak, never XP. The player always moves forward. The question is only: how fast?

---

## 2. User Persona

### Primary Persona: "The Aspiring Disciplined"

**Name:** Aryan / Nadia (gender-neutral arc)  
**Age:** 18–34  
**Context:** A student, early-career professional, or self-employed creator who wants to build one meaningful daily practice — meditation, writing, coding, gym, language learning, reading — but struggles with consistency.

**Psychographic Profile:**
- Has tried other habit apps (Habitica, Streaks, Notion trackers) — quit within 3 weeks
- Motivated by narrative and progress visualization, not raw statistics
- Familiar with RPG games; responds to rank-up moments and achievement unlocks
- Self-aware enough to know they need accountability, but not external social pressure
- Dislikes guilt-based design (e.g., Duolingo's streak owl)

**Goals:**
- Build one non-negotiable daily practice
- See visible proof of growth over time
- Feel like the effort compounds into something meaningful

**Frustrations:**
- Breaking a streak feels like "starting from zero"
- No clear sense of what level of consistency they are at
- Generic apps don't reflect the weight of what they're trying to build

**Quote:** "I don't need to be reminded. I need a reason to feel proud when I do it."

---

## 3. Feature List

### MVP (v1.0) — Core Loop

| ID | Feature | Priority |
|----|---------|----------|
| F-01 | Onboarding: Set one Quest (name + category + why) | P0 |
| F-02 | Daily check-in: one-tap with optional note | P0 |
| F-03 | XP system with formula-based rewards | P0 |
| F-04 | Level progression (1–100) with thresholds | P0 |
| F-05 | Streak tracking (current + longest) | P0 |
| F-06 | Streak freeze mechanic (limited uses) | P0 |
| F-07 | Rank system (E → D → C → B → A → S → SS → SSS) | P0 |
| F-08 | Dashboard with key stats at a glance | P0 |
| F-09 | Level-up animation + rank-up ceremony screen | P0 |
| F-10 | Failure / comeback state (no XP loss, streak reset only) | P0 |
| F-11 | Local persistence (localStorage) | P0 |
| F-12 | Dark mode UI (default) | P0 |
| F-13 | Stat system: 5 tracked dimensions | P1 |
| F-14 | Achievements: 20 unlockable badges | P1 |
| F-15 | Quest journal: historical log with notes | P1 |
| F-16 | Weekly summary modal (Sunday night) | P1 |

### Future (v2.0+)

| ID | Feature | Notes |
|----|---------|-------|
| F-17 | Supabase cloud sync (account + backup) | Auth via magic link |
| F-18 | Multiple quests (unlock at S-rank) | Milestone gate |
| F-19 | Quest re-roll: change quest without losing rank | Penalty: -15% XP |
| F-20 | Prestige system (SSS → reset to E with prestige badge) | Loop extension |
| F-21 | Custom rank titles | User-named ranks |
| F-22 | PWA: installable mobile experience | Service worker |
| F-23 | Daily motivational system quotes (contextual) | Local quote bank |
| F-24 | Animated rank insignia / avatar frame evolution | Canvas/Lottie |
| F-25 | Export journal to PDF/Markdown | Personal archival |
| F-26 | Boss Battle events (weekly challenge for bonus XP) | Engagement spike |

---

## 4. Detailed Mechanics Specification

### 4.1 XP System

#### Base XP per Check-In

The base XP earned for completing a daily quest is fixed at **100 XP**.

#### Streak Multiplier

Streak multipliers reward consistency without making recovery impossible.

```
streak_multiplier = 1.0 + min(streak_days / 100, 1.0)
```

| Streak Length | Multiplier | XP per Day |
|--------------|-----------|------------|
| 0–9 days | 1.0x | 100 XP |
| 10–19 days | 1.1x | 110 XP |
| 20–29 days | 1.2x | 120 XP |
| 30–49 days | 1.3x | 130 XP |
| 50–74 days | 1.5x | 150 XP |
| 75–99 days | 1.75x | 175 XP |
| 100+ days | 2.0x (cap) | 200 XP |

#### Bonus XP Events

| Trigger | Bonus XP | Frequency |
|---------|---------|-----------|
| First check-in ever | +200 XP | Once |
| Streak milestone (7, 14, 30, 60, 100, ...) | +100–500 XP | Per milestone |
| Note added to check-in | +10 XP | Daily (encourages reflection) |
| Stat category chosen | +5 XP per stat | Daily |
| Achievement unlocked | +50–500 XP | Per achievement |

#### XP Loss Policy

**XP is never deducted.** Not for missed days. Not for anything. XP is a permanent record of total effort. This is the core psychological distinction from streak-based apps. The only consequence of a missed day is streak loss.

---

### 4.2 Level System

#### Level Thresholds

Total XP required to reach each level follows a polynomial curve: `XP(L) = 100 * L^1.8`

| Level | XP Required (total) | XP Required (from prev) | Label |
|-------|---------------------|------------------------|-------|
| 1 | 0 | — | Awakened |
| 5 | 2,297 | ~575 | Initiate |
| 10 | 6,310 | ~450 | Seeker |
| 20 | 21,113 | ~750 | Challenger |
| 30 | 42,869 | ~1,200 | Veteran |
| 40 | 72,284 | ~2,100 | Elite |
| 50 | 109,657 | ~2,500 | Master |
| 60 | 154,908 | ~3,000 | Grandmaster |
| 75 | 231,098 | ~4,200 | Legend |
| 90 | 319,425 | ~5,200 | Mythic |
| 100 | 398,107 | ~7,800 | Transcendent |

**Design Rationale:** At a perfect 2.0x streak (100+ day streak), the user earns 200 XP/day. Level 100 requires ~398K XP total, which is about 5.5 years of perfect daily effort. Most users will reach Level 50 in 2–3 years of serious consistency, which is aspirational but achievable.

Level progression display: current level shown as large numeral, XP bar shows progress to next level only (not total), with XP to next shown as a number.

---

### 4.3 Rank System

Rank is a coarser, more narrative measure of consistency than level. It is calculated from a **Consistency Score** rather than raw XP, making it harder to game with single bursts.

#### Consistency Score

```
consistency_score = (total_check_ins / total_days_since_start) * 100
```
Capped at 100. Minimum 14 days to calculate rank.

Additionally, rank requires minimum level gates to prevent early inflation.

#### Rank Table

| Rank | Title | Min Consistency | Min Level | Color | Aura |
|------|-------|----------------|-----------|-------|------|
| E | Ordinary Human | 0% | 1 | #6B7280 (gray) | None |
| D | Hunter Initiate | 30% | 5 | #22C55E (green) | Faint pulse |
| C | Proven Hunter | 50% | 15 | #3B82F6 (blue) | Glow ring |
| B | Elite Hunter | 65% | 30 | #A855F7 (purple) | Rotating ring |
| A | Shadow Hunter | 78% | 50 | #F59E0B (amber) | Flare burst |
| S | Sovereign | 88% | 70 | #EF4444 (red) | Shockwave |
| SS | Monarch | 95% | 85 | #F97316 (orange) | Flame halo |
| SSS | Immortal | 99%+ | 95 | #FFFFFF (white) | Prismatic |

**Rank-Down Prevention:** Rank cannot drop more than one tier, and only after 30+ consecutive missed days. This prevents demoralization from brief slumps. The system logs a "fallen" state which adds narrative weight to the comeback rather than just punishing.

---

### 4.4 Streak Mechanics

#### Streak Rules

- Streak increments by 1 for every calendar day a check-in is logged before midnight local time.
- Streak resets to 0 if the user misses a day without using a Freeze.
- The **longest streak** is stored separately and never resets.
- After a streak break, a "Comeback" multiplier applies: first 3 days after a break earn +20% bonus XP.

#### Streak Freeze

A Streak Freeze preserves the current streak for one missed day.

**Earning Freezes:**
- 1 freeze awarded every 7-day streak milestone (7, 14, 21, etc.)
- Maximum 3 freezes stored at any time.
- Freezes do not auto-apply — user must manually activate before or on the missed day.
- Freeze activation window: can be used up to 24 hours after the missed day (grace period).

**Freeze UI:** Shown as ice-crystal icons on the dashboard. Activation is a deliberate long-press to prevent accidents.

#### Streak Milestones (with rewards)

| Streak Days | Reward | Bonus XP |
|------------|--------|---------|
| 7 | +1 Freeze | +100 XP |
| 14 | Badge: "Two Weeks Strong" | +150 XP |
| 30 | Rank-check notification | +300 XP |
| 60 | Badge: "Relentless" | +400 XP |
| 100 | Special animation + "Century Hunter" badge | +500 XP |
| 200 | Badge: "Iron Will" | +700 XP |
| 365 | "Year One" legendary badge + prestige option | +2000 XP |

---

### 4.5 Stat System

Each check-in, the user optionally tags which "stat" they feel they trained. This builds a radar chart over time and adds meta-narrative to the quest.

**Five Core Stats:**

| Stat | Symbol | Represents | Example Quests |
|------|--------|-----------|----------------|
| FOCUS | 🧠 | Mental clarity, depth of attention | Meditation, deep work, reading |
| DISCIPLINE | ⚔️ | Showing up regardless of mood | Gym, cold shower, journaling |
| ENDURANCE | 🔥 | Physical and mental stamina | Running, fasting, studying |
| WISDOM | 📖 | Knowledge accumulation, skill | Language learning, coding, writing |
| VITALITY | 💎 | Energy, health, recovery | Sleep tracking, nutrition, stretching |

Each completed check-in where a stat is tagged adds **1 point** to that stat. Stats display as a radar/spider chart. Max stat value is uncapped; the visual scales to the highest stat. This creates a visible "build" for the user's character — a runner looks different from a meditator on the chart.

---

### 4.6 Failure & Comeback States

**When a streak breaks:**
1. Streak counter resets to 0.
2. A "Fallen State" notification fires — tone: somber acknowledgment, not shaming. e.g., *"Your streak ended. Your XP remains. Hunters fall. Legends rise back."*
3. Comeback Mode activates for 3 days: +20% XP, special "Comeback" banner.
4. If the user has been absent for 7+ days, a "Return of the Hunter" screen fires on next open — with XP progress shown prominently to reinforce permanence.

**What never happens:**
- XP subtraction.
- Rank drop from a single break.
- Locked features or punitive UI states.
- Streak shown with a sad/broken icon (use neutral language).

**Inactivity State (30+ days):**
- App shows "Dormant Hunter" state on open.
- Shows total XP, rank, and longest streak prominently.
- Single CTA: "Resume Quest."
- No guilt mechanics. Pure re-engagement.

---

### 4.7 Achievements System

20 base achievements. A selection:

| ID | Badge Name | Trigger | XP Bonus |
|----|-----------|---------|---------|
| A-01 | First Blood | First check-in | +200 XP |
| A-02 | Initiated | Reach Level 5 | +50 XP |
| A-03 | Week One | 7-day streak | +100 XP |
| A-04 | The Long Road | 30-day streak | +300 XP |
| A-05 | Century Mark | 100-day streak | +500 XP |
| A-06 | Reflective | Add 10 total notes | +75 XP |
| A-07 | Deep Thinker | Add 50 total notes | +150 XP |
| A-08 | D-Rank Hunter | Reach D rank | +100 XP |
| A-09 | Elite Hunter | Reach A rank | +300 XP |
| A-10 | Sovereign | Reach S rank | +500 XP |
| A-11 | Immortal | Reach SSS rank | +2000 XP |
| A-12 | Comeback King | Complete 3 check-ins after a streak break | +100 XP |
| A-13 | Iron Will | 200-day streak | +700 XP |
| A-14 | Stat Master | One stat reaches 50 | +200 XP |
| A-15 | Balanced Hunter | All 5 stats above 10 | +250 XP |
| A-16 | Year One | 365-day total check-ins | +2000 XP |
| A-17 | Frozen in Time | Use first streak freeze | +50 XP |
| A-18 | Ice Vault | Hold 3 freezes simultaneously | +75 XP |
| A-19 | The Why | Complete onboarding "why" field | +25 XP |
| A-20 | Midnight Hunter | Check in between 11 PM–midnight | +30 XP |

**Hidden achievements** (5 additional, not shown until unlocked):
- "Ghost Protocol" — check in exactly at midnight
- "The Grind" — check in 30 days with a note each time
- "Unmovable" — reach 50-day streak without using a freeze
- "Phoenix" — reach higher longest streak after a full reset
- "Beyond Limits" — reach Level 75

---

## 5. Screen-by-Screen UX Flow

### 5.1 Onboarding Flow (First Launch Only)

```
SCREEN 1: Welcome
──────────────────
- Full-screen dark bg with animated particle field
- Centered: "SOLO QUEST" logotype
- Tagline: "One quest. One you. Every day."
- CTA: "Begin Your Journey" button (glowing border)
- No login required

SCREEN 2: Name Your Quest
──────────────────────────
- Prompt: "What will you do every single day?"
- Large text input (autofocus)
- Below input: 6 category pills (tap to select icon/color)
  [🧠 Mind] [⚔️ Body] [📖 Skill] [🔥 Create] [💎 Health] [✦ Custom]
- Skip/Next navigation

SCREEN 3: Set Your Why
──────────────────────
- Prompt: "Why does this matter to you?"
- Multiline text input (optional — skip available)
- Subtext: "Your 'why' is stored privately. It fuels your quest."
- Completing this awards hidden XP (+25)

SCREEN 4: Choose Your Starting Title
──────────────────────────────────────
- Display: rank "E — Ordinary Human"
- Explanatory text: "Everyone starts here. The question is where you end."
- Shows rank ladder briefly (E through SSS) as vertical timeline
- "Accept Your Rank" CTA

SCREEN 5: Quest Confirmed
──────────────────────────
- Summary card: Quest name, category icon, "why" (if set)
- Animated "Quest Registered" stamp effect
- XP counter starts at 0, animates to 25 (why bonus) or 0
- CTA: "Enter the System"
→ Routes to Dashboard
```

---

### 5.2 Dashboard (Home Screen)

```
LAYOUT: Single scrollable screen, dark background

TOP SECTION: Hunter Card
─────────────────────────
[Rank insignia glyph] RANK: E / LEVEL: 1
[Quest Name — bold, large]
[Category icon + category label]

MID SECTION: XP Progress
─────────────────────────
XP Bar: [████████░░░░░░░░] 250 / 630 XP to Level 3
Level number: large, prominent
"Next level in X days at current pace" — calculated estimate

STREAK SECTION
──────────────
🔥 Current Streak: 12 days
🏆 Longest Streak: 31 days
❄️ Freezes: [ice icon] [ice icon] [empty]

DAILY CHECK-IN BUTTON (CTA)
────────────────────────────
Large, full-width button: "CHECK IN TODAY"
State A (not done): glowing border, pulsing
State B (done today): muted, "Done for today ✓"

STATS RADAR (collapsed by default, tap to expand)
──────────────────────────────────────────────────
Spider chart of 5 stats, current values shown

ACHIEVEMENTS ROW
─────────────────
Horizontal scroll: locked badges (greyed) + unlocked (glowing)
"X badges unlocked" counter

RECENT JOURNAL (last 3 entries)
──────────────────────────────────
Date | Note preview | XP earned
→ "View All" link to Journal screen
```

---

### 5.3 Check-In Flow

```
SCREEN: Check-In Modal (slides up from bottom)
───────────────────────────────────────────────

Step 1: Confirmation tap
- "Did you complete [Quest Name] today?"
- Large YES button (takes up 80% of button area)
- Small "No / Use Freeze" option below

Step 2 (after YES): Stat Tag (optional)
- "What did you train today?"
- 5 stat pills to tap (multi-select allowed)
- "Skip" option

Step 3 (optional): Add a note
- Short text input: "How did it feel? (optional)"
- Character limit: 200
- "Submit" button

Step 4: Reward Screen
──────────────────────
- XP burst animation: "+110 XP" flies up from center
- Streak counter increments with flame animation
- If level-up: LEVEL UP CEREMONY fires (see 5.4)
- If achievement unlocked: badge slides in
- If streak milestone: milestone card appears
- Dismiss: tap anywhere or auto-dismiss after 3s
```

---

### 5.4 Level-Up Ceremony

```
FULL-SCREEN OVERLAY (blocks everything beneath)
─────────────────────────────────────────────────
- Background: pulsing dark with particle shockwave
- Center: old level number cracks/shatters (CSS animation)
- New level number emerges with light burst
- Text: "LEVEL [N] ACHIEVED"
- Subtext: "[Quest Name] grows stronger."
- XP progress bar fills completely, then re-draws for new level
- Duration: ~2.5 seconds, then auto-dismiss to Dashboard

If rank-up also triggers simultaneously:
→ Rank-Up Ceremony plays AFTER Level-Up ceremony (sequential)
```

---

### 5.5 Rank-Up Ceremony

```
FULL-SCREEN OVERLAY
────────────────────
- Background changes to rank's theme color (dim)
- Old rank glyph fades out
- New rank glyph materializes with halo effect
- Text: "[Old Rank] → [New Rank]"
- Large title: "[New Rank Title]"
- e.g., "ORDINARY HUMAN → HUNTER INITIATE"
- Subtle sound design note: distinct rank tones (D=low bell, S=choir swell)
- CTA: "Claim Your Rank" — forces deliberate interaction
- Shares stats: "You've checked in X times. Consistency: X%."
```

---

### 5.6 Journal Screen

```
HEADER: "Quest Journal" + total check-ins count

FILTER BAR: All | With Notes | Milestones | Achievements

LIST: Reverse chronological
─────────────────────────────
Each entry:
[DATE] [STREAK DAY #]
[Stat tags if any]
[Note text if any]
[XP earned] [Badges if any]

Empty state: "Your journey starts with the first entry."
```

---

### 5.7 Stats / Profile Screen

```
TOP: Hunter Card (same as Dashboard header)

SECTION: Stats Radar
─────────────────────
Full radar chart, 5 axes, current point values labeled

SECTION: Lifetime Stats
────────────────────────
Total XP | Total Check-ins | Total Days Since Start
Longest Streak | Current Streak | Avg XP/Day
Days to Level [N+1] at current pace
Consistency Score: XX%

SECTION: Achievements
──────────────────────
Grid: 5x5 badge grid
Unlocked = full color + glow
Locked = silhouette + "???" label
Tap unlocked to see name + date earned

SECTION: Quest Details
───────────────────────
Quest Name | Category | Started On | "Your Why" (if set)
[Edit Quest Name button — penalty-free rename]
```

---

### 5.8 Settings Screen

```
APPEARANCE: Dark / Light / System
NOTIFICATIONS: Daily reminder time (local notification via browser API)
RESET OPTIONS:
  - Reset Streak Only (keeps XP)
  - Full Reset (confirmation required, double-confirm)
EXPORT: Download Journal as Markdown
DATA: "Your data is stored locally on this device."
ABOUT: Version, link to GitHub repo
```

---

## 6. Tech Stack Recommendation

### Core Stack

| Layer | Tool | Rationale |
|-------|------|-----------|
| Framework | **React 18 + Vite** | Fast HMR, modern JSX, massive ecosystem |
| Language | **TypeScript** | Type safety essential for game logic |
| Styling | **Tailwind CSS v4** | Utility-first, dark mode trivial, no runtime overhead |
| State Management | **Zustand** | Lightweight, no boilerplate, localStorage middleware built-in |
| Persistence (MVP) | **localStorage via Zustand persist** | Zero backend, instant, works offline |
| Persistence (v2) | **Supabase free tier** | 500MB storage, auth, realtime, generous free plan |
| Animation | **Framer Motion** | Production-grade React animations, declarative |
| Charts | **Recharts** | Radar chart for stats, lightweight, composable |
| Icons | **Lucide React** | Clean, consistent icon set |
| Date Handling | **date-fns** | Lightweight, tree-shakeable, no Moment.js baggage |
| Notifications | **Web Notifications API** | Native browser push, no service required for MVP |
| Testing | **Vitest + React Testing Library** | Vite-native, fast, free |
| Deployment | **Vercel free tier** | Git-push deploy, HTTPS, custom domain, no config |
| Version Control | **GitHub** | Portfolio visibility, free, CI/CD hooks |

### Why This Stack Is Portfolio-Grade

- Vite + React 18 + TypeScript is the current industry standard.
- Zustand is increasingly preferred over Redux in modern projects.
- Framer Motion demonstrates professional animation knowledge.
- Supabase v2 integration shows full-stack capability without backend code.
- The combination demonstrates: state management, animation, data persistence, game logic, and responsive design in one project.

### Dev Setup Commands

```bash
npm create vite@latest solo-quest -- --template react-ts
cd solo-quest
npm install tailwindcss @tailwindcss/vite
npm install zustand framer-motion recharts lucide-react date-fns
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Project Structure

```
solo-quest/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable primitives (Button, Card, Modal)
│   │   ├── dashboard/       # DashboardScreen, HunterCard, XPBar
│   │   ├── checkin/         # CheckInModal, RewardScreen
│   │   ├── ceremonies/      # LevelUpCeremony, RankUpCeremony
│   │   ├── journal/         # JournalScreen, JournalEntry
│   │   ├── stats/           # StatsScreen, RadarChart
│   │   └── onboarding/      # OnboardingFlow, steps 1–5
│   ├── store/
│   │   ├── useGameStore.ts  # Main Zustand store
│   │   └── types.ts         # All TypeScript interfaces
│   ├── lib/
│   │   ├── xp.ts            # XP formula functions
│   │   ├── levels.ts        # Level threshold calculations
│   │   ├── ranks.ts         # Rank evaluation logic
│   │   ├── streaks.ts       # Streak logic + freeze handling
│   │   ├── achievements.ts  # Achievement check engine
│   │   └── dates.ts         # Date utility wrappers
│   ├── constants/
│   │   ├── ranks.ts         # Rank definitions array
│   │   ├── achievements.ts  # Achievement definitions
│   │   └── stats.ts         # Stat definitions
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## 7. Data Model / Schema

### TypeScript Interfaces

```typescript
// Core quest definition
interface Quest {
  id: string;                        // nanoid()
  name: string;                      // e.g., "Meditate 20 minutes"
  category: QuestCategory;           // 'mind' | 'body' | 'skill' | 'create' | 'health' | 'custom'
  why: string | null;                // User's personal why
  createdAt: string;                 // ISO 8601 date string
  customCategoryLabel?: string;      // Only if category === 'custom'
}

// One entry per day checked-in
interface CheckIn {
  id: string;                        // nanoid()
  date: string;                      // 'YYYY-MM-DD' format (local date)
  xpEarned: number;                  // Total XP including bonuses
  streakDay: number;                 // Streak length at time of check-in
  note: string | null;               // Optional reflection note
  statsTagged: StatKey[];            // ['focus', 'discipline', ...] (0–5 items)
  bonusEvents: BonusEvent[];         // Log of bonus XP sources
  timestamp: string;                 // ISO 8601 full datetime
}

type StatKey = 'focus' | 'discipline' | 'endurance' | 'wisdom' | 'vitality';

interface BonusEvent {
  type: 'note' | 'streak_milestone' | 'achievement' | 'comeback' | 'first_checkin';
  xp: number;
  label: string;
}

// Streak state
interface StreakState {
  current: number;
  longest: number;
  lastCheckInDate: string | null;    // 'YYYY-MM-DD'
  freezesAvailable: number;          // 0–3
  freezesUsed: number;               // Lifetime count
  freezeActivatedForDate: string | null; // Date freeze is protecting
  inComebackMode: boolean;
  comebackDaysRemaining: number;     // 0–3
}

// Computed player stats
interface PlayerStats {
  totalXP: number;
  level: number;
  xpInCurrentLevel: number;         // XP earned within current level
  xpToNextLevel: number;            // XP needed to reach next level
  rank: RankKey;
  consistencyScore: number;         // 0–100
  totalCheckIns: number;
  totalDaysSinceStart: number;
  statPoints: Record<StatKey, number>; // e.g., { focus: 23, discipline: 41, ... }
}

type RankKey = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

interface RankDefinition {
  key: RankKey;
  title: string;                    // "Ordinary Human", "Hunter Initiate", etc.
  minConsistency: number;           // 0–100
  minLevel: number;
  color: string;                    // Hex
  glowColor: string;                // For CSS box-shadow
  auraType: 'none' | 'pulse' | 'glow' | 'ring' | 'flare' | 'shockwave' | 'flame' | 'prismatic';
}

// Achievement definition
interface AchievementDefinition {
  id: string;                       // e.g., 'A-01'
  name: string;
  description: string;
  hidden: boolean;                  // True = not visible until unlocked
  xpReward: number;
  checkCondition: (state: GameState) => boolean;
}

// Achievement instance (when earned)
interface EarnedAchievement {
  achievementId: string;
  earnedAt: string;                 // ISO 8601
}

// Full persisted game state (root Zustand store)
interface GameState {
  version: number;                  // Schema version for migration
  quest: Quest | null;
  checkIns: CheckIn[];
  streak: StreakState;
  earnedAchievements: EarnedAchievement[];
  hasCompletedOnboarding: boolean;
  pendingCeremony: PendingCeremony | null;  // Level-up or rank-up awaiting display
  settings: UserSettings;
}

interface PendingCeremony {
  type: 'level_up' | 'rank_up' | 'streak_milestone';
  previousValue: string | number;
  newValue: string | number;
  xpGained?: number;
}

interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  reminderTime: string | null;      // '21:00' format
  reminderEnabled: boolean;
}
```

### localStorage Key

```typescript
const STORAGE_KEY = 'solo-quest-v1';
// Zustand persist middleware serializes full GameState to this key
// On schema version bump, migration function runs on hydration
```

### Supabase Schema (v2 — when adding cloud sync)

```sql
-- Users table (Supabase Auth provides auth.users)
create table public.profiles (
  id uuid references auth.users(id) primary key,
  created_at timestamptz default now()
);

-- Game state table (one row per user, full JSON blob)
create table public.game_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) unique not null,
  state jsonb not null,             -- Full GameState JSON
  updated_at timestamptz default now()
);

-- Row Level Security: users can only access their own row
alter table public.game_states enable row level security;
create policy "Own state only" on public.game_states
  using (auth.uid() = user_id);

-- Check-ins table (for future querying/analytics)
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  date date not null,
  xp_earned integer not null,
  streak_day integer not null,
  note text,
  stats_tagged text[],
  created_at timestamptz default now(),
  unique(user_id, date)
);
```

---

## 8. Component Architecture

### Key Logic Modules

#### `lib/xp.ts`

```typescript
export const BASE_XP = 100;

export function calculateStreakMultiplier(streak: number): number {
  return 1.0 + Math.min(streak / 100, 1.0);
}

export function calculateCheckInXP(streak: number, hasNote: boolean, statCount: number): number {
  const base = BASE_XP;
  const multiplier = calculateStreakMultiplier(streak);
  const noteBonus = hasNote ? 10 : 0;
  const statBonus = statCount * 5;
  return Math.round(base * multiplier) + noteBonus + statBonus;
}
```

#### `lib/levels.ts`

```typescript
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level, 1.8));
}

export function levelFromXP(totalXP: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
    if (level >= 100) return 100;
  }
  return level;
}

export function xpProgressInLevel(totalXP: number): { current: number; required: number } {
  const level = levelFromXP(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  return {
    current: totalXP - currentLevelXP,
    required: nextLevelXP - currentLevelXP,
  };
}
```

#### `lib/ranks.ts`

```typescript
import { RANK_DEFINITIONS } from '../constants/ranks';

export function calculateConsistency(totalCheckIns: number, totalDays: number): number {
  if (totalDays < 14) return 0;
  return Math.min(100, Math.round((totalCheckIns / totalDays) * 100));
}

export function evaluateRank(level: number, consistency: number): RankKey {
  const eligible = RANK_DEFINITIONS
    .filter(r => level >= r.minLevel && consistency >= r.minConsistency)
    .sort((a, b) => b.minConsistency - a.minConsistency);
  return eligible[0]?.key ?? 'E';
}
```

---

## 9. Success Metrics

### Primary Metrics (Tracked via Local Analytics Log)

| Metric | Definition | Target (30-day) |
|--------|-----------|-----------------|
| D7 Retention | Users who check in at least once in Days 2–7 | > 40% |
| D30 Retention | Users with 1+ check-in in week 4 | > 20% |
| Check-in Completion Rate | Check-ins / days since install | > 55% |
| Streak Survival Rate | Users who recover after a streak break | > 35% |
| Rank-Up Rate | % of users who reach D-rank or higher | > 30% (90 days) |
| Level 10 Rate | % of users who reach Level 10 | > 25% (90 days) |

### Portfolio / Showcase Metrics

- GitHub stars as proxy for developer appeal
- Vercel analytics for page views and session duration
- Note count growth (proxy for engagement depth)

### Health Indicators (Anti-Metrics)

- If "Full Reset" usage exceeds 15% of users in first 30 days → Failure/comeback flow needs redesign
- If median check-in duration exceeds 30 seconds → UI is too slow, simplify

---

## 10. Visual Design System

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #0A0A0F;      /* Near-black, slightly blue-tinted */
  --bg-card: #12121A;          /* Card surfaces */
  --bg-elevated: #1A1A26;      /* Modals, elevated surfaces */
  --bg-input: #1E1E2E;         /* Input fields */

  /* Text */
  --text-primary: #E8E8F0;     /* Primary text */
  --text-secondary: #8888AA;   /* Subdued text */
  --text-muted: #44445A;       /* Very muted */

  /* Accent (default: amber/gold — hunter energy) */
  --accent-primary: #F59E0B;
  --accent-glow: rgba(245, 158, 11, 0.3);

  /* Ranks */
  --rank-e: #6B7280;
  --rank-d: #22C55E;
  --rank-c: #3B82F6;
  --rank-b: #A855F7;
  --rank-a: #F59E0B;
  --rank-s: #EF4444;
  --rank-ss: #F97316;
  --rank-sss: #FFFFFF;

  /* Semantic */
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;

  /* XP Bar gradient */
  --xp-bar: linear-gradient(90deg, #3B82F6, #A855F7, #F59E0B);
}
```

### Typography

```css
/* Display: Orbitron (Google Fonts) — geometric, sci-fi, strong */
/* Body: Inter (fallback) or Sora — clean, modern, readable */

--font-display: 'Orbitron', monospace;     /* Level numbers, rank names, titles */
--font-body: 'Sora', sans-serif;           /* All body text, UI labels */
--font-mono: 'JetBrains Mono', monospace;  /* Stats, numbers, dates */
```

### Spacing Scale

Base: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64px. Tailwind default spacing works.

### Border Radius

Cards: `rounded-xl` (12px). Buttons: `rounded-lg` (8px). Pills: `rounded-full`.

### Animation Principles

1. **Check-in XP burst:** `scale 0.8 → 1.3 → 1.0` with opacity fade, 400ms ease-out
2. **Level-up number:** `scale 2.0 → 1.0` with blur-to-sharp, 600ms spring
3. **Rank-up glyph:** particle explosion (CSS keyframes), 1200ms
4. **XP bar fill:** spring easing on width, 800ms, with glow pulse at 100%
5. **Check-in button:** gentle pulsing glow (3s loop) when action is pending
6. **Streak increment:** counter rolls up number with slot-machine effect, 300ms

---

## 11. Edge Cases & Error Handling

### Date/Timezone Issues

- All dates stored as local 'YYYY-MM-DD' strings using `format(new Date(), 'yyyy-MM-dd')` from date-fns.
- Never use UTC dates for streak logic — a check-in at 11:58 PM local time must count for that day.
- If user crosses timezone (e.g., travels), app uses device local time. Edge case documented but not handled in MVP.

### Check-In Idempotency

- Check-ins are keyed by date. If a user somehow opens the modal twice on the same day, the `date` uniqueness check prevents duplicate entries. UI state should reflect "already checked in today" immediately after first check-in.

### Freeze Grace Period

- If today's date !== `lastCheckInDate + 1 day`, a missed day is detected on next app open.
- User has until end of next day (i.e., 48h window from the missed day start) to activate a freeze retroactively.
- After 48h, the streak break is permanent and freeze cannot restore it.

### localStorage Quota

- localStorage limit is ~5MB. At 200 bytes/check-in average, 5MB supports ~25,000 check-ins (~68 years of daily check-ins). Not a concern.

### Schema Migration

- `version` field on `GameState` enables migrations.
- On hydration, compare stored version to `CURRENT_VERSION`. If lower, run migration chain.
- Example: v1 → v2 adds `statPoints` field with defaults. Never destructive.

### First Launch / Empty State

- If `hasCompletedOnboarding === false`, always route to Onboarding regardless of URL.
- If `quest === null` but `hasCompletedOnboarding === true` (orphaned state), treat as fresh start.

---

## 12. Development Roadmap

### Phase 1: Core Loop (Weeks 1–3)

- [ ] Project scaffolding (Vite + React + TypeScript + Tailwind)
- [ ] Zustand store setup with localStorage persist
- [ ] Game logic modules: xp.ts, levels.ts, ranks.ts, streaks.ts
- [ ] Onboarding flow (5 screens)
- [ ] Dashboard layout (non-interactive first)
- [ ] Check-in modal (basic, no animations)
- [ ] Streak tracking + freeze logic

### Phase 2: Polish & Feedback (Weeks 4–5)

- [ ] Level-up ceremony animation
- [ ] Rank-up ceremony animation
- [ ] XP burst animations on check-in
- [ ] Streak milestone notifications
- [ ] Achievement engine + badge grid

### Phase 3: Depth (Weeks 6–7)

- [ ] Journal screen with filtering
- [ ] Stats radar chart (Recharts)
- [ ] Weekly summary modal
- [ ] Settings screen
- [ ] Export to Markdown

### Phase 4: Portfolio Hardening (Week 8)

- [ ] Full TypeScript strict mode
- [ ] Unit tests for all game logic modules (Vitest)
- [ ] PWA manifest + service worker
- [ ] Performance audit (Lighthouse > 90)
- [ ] Deploy to Vercel
- [ ] README with screenshots + mechanics explanation
- [ ] GitHub repo cleanup for portfolio presentation

### Phase 5: v2 Cloud Sync (Future)

- [ ] Supabase project setup
- [ ] Magic link auth flow
- [ ] State sync on check-in
- [ ] Conflict resolution (last-write-wins with timestamp)
- [ ] Multiple quest unlock at S-rank

---

## Appendix A: XP Formula Quick Reference

```
Daily XP = round(100 × (1 + min(streak/100, 1))) + note_bonus + stat_bonus

note_bonus = 10 if note was written, else 0
stat_bonus = 5 × number of stats tagged (0–5)

Max XP per day (cap):
  200 (base × 2.0 multiplier) + 10 (note) + 25 (5 stats) = 235 XP/day
```

## Appendix B: Rank Evaluation Trigger Points

Rank is re-evaluated on every check-in. Re-evaluation runs:
1. After XP is added (to get new level)
2. After check-in count increments (to update consistency score)
3. If rank increases → queue `PendingCeremony` of type `rank_up`

Rank-down check runs separately on app open if last check-in was 30+ days ago.

## Appendix C: Notification Strategy

Use `Notification API` (browser). Request permission after first successful check-in (warm ask — user has already gotten value). Store reminder time in settings. Use `setTimeout` or `setInterval` with `Date` comparison on app focus events for MVP. For reliable delivery when app is closed, a Service Worker is required (Phase 4).

---

*End of PRD — Solo Quest v1.0.0*  
*Build something you'd actually use.*
