# Solo Quest

Solo Quest is a narrative-driven, gamified personal growth application that transforms a single daily commitment into an RPG progression system. Instead of relying on traditional, high-pressure habit tracking, Solo Quest introduces a progression-first framework built around permanent progression, narrative-based rank gates, and streak recovery mechanics.

The application is designed for individuals seeking to cultivate a single, high-investment daily practice without the demoralizing effects of traditional habit trackers that punish missed days by resetting total progress.

---

## Core Philosophy

### Permanence over Perfection
Traditional habit tracking systems fail because they rely on punishment-based designs. Breaking a multi-week streak feels catastrophic, often leading users to abandon their habits entirely. 

Solo Quest corrects this by enforcing one core rule: **XP is never subtracted.** 
*   A missed day resets the current streak, but accumulated Experience Points (XP) remain permanent.
*   The player always moves forward; consistency only dictates the velocity of progression.
*   Breaking a streak transitions the player into a narrative "Comeback Mode" rather than a punitive failure state.

---

## Detailed Game Mechanics

### 1. Experience Points (XP) System
The base experience points earned for a daily check-in is fixed at 100 XP, adjusted by a streak multiplier, optional reflection note bonus, and stat training tags:

$$\text{Daily XP} = \text{round}(100 \times \text{streak\_multiplier}) + \text{note\_bonus} + \text{stat\_bonus}$$

#### Streak Multiplier
The streak multiplier rewards daily consistency without creating an insurmountable gap upon reset:
*   Formula: `streak_multiplier = 1.0 + min(streak_days / 100, 1.0)`
*   The multiplier scales linearly from 1.0x to a hard cap of 2.0x reached at a 100-day streak.

#### XP Bonuses
*   **First Check-In:** +200 XP (once per quest).
*   **Onboarding Completion:** +25 XP (for defining the personal "Why").
*   **Reflection Note:** +10 XP (awarded daily for writing a check-in log).
*   **Stat Tags:** +5 XP per core stat tagged (up to +25 XP daily).
*   **Comeback Bonus:** First 3 consecutive check-ins logged after a streak break receive a +20% bonus multiplier.

---

### 2. Level Progression Curve
Total experience required to reach any given level (L) follows a polynomial growth curve to represent the compounding difficulty of high-level mastery:

$$\text{Total XP}(L) = 100 \times L^{1.8}$$

*   **Level 1 (Awakened):** 0 XP
*   **Level 5 (Initiate):** 2,297 XP (~23 days of base check-ins)
*   **Level 10 (Seeker):** 6,310 XP
*   **Level 30 (Veteran):** 42,869 XP
*   **Level 50 (Master):** 109,657 XP (~1.5 years of perfect consistency)
*   **Level 100 (Transcendent):** 398,107 XP (~5.5 years of perfect consistency)

---

### 3. Rank Evaluation & Level Gates
Rank is a coarser, narrative-driven measure of long-term consistency. Unlike levels, ranks are derived from a Consistency Score combined with mandatory minimum level gates to prevent early rank inflation:

$$\text{Consistency Score} = \left(\frac{\text{Total Check-Ins}}{\text{Total Days Since Quest Start}}\right) \times 100$$

*   **Evaluation Gate:** A minimum of 14 days since starting the quest is required to calculate consistency and rank.
*   **Rank Progression:**
    *   **Rank E (Ordinary Human):** Default starting rank, 0% consistency, Level 1.
    *   **Rank D (Hunter Initiate):** 30% consistency, Level 5.
    *   **Rank C (Proven Hunter):** 50% consistency, Level 15.
    *   **Rank B (Elite Hunter):** 65% consistency, Level 30.
    *   **Rank A (Shadow Hunter):** 78% consistency, Level 50.
    *   **Rank S (Sovereign):** 88% consistency, Level 70.
    *   **Rank SS (Monarch):** 95% consistency, Level 85.
    *   **Rank SSS (Immortal):** 99%+ consistency, Level 95.
*   **Rank-Down Prevention:** To prevent severe discouragement, a rank cannot drop more than one tier at a time, and a demotion can only occur after 30+ consecutive days of total inactivity, which flags the player as a "Dormant Hunter."

---

### 4. Streak Freeze and Grace Periods
*   **Earning Freezes:** 1 Streak Freeze is awarded at every 7-day streak milestone.
*   **Capacity Limit:** A player can store a maximum of 3 freezes at any given time.
*   **Grace Period:** Freezes must be manually activated. The activation window remains open for a 24-hour grace period following the missed calendar day.

---

### 5. Five-Dimension Core Stats
During daily check-ins, players optionally tag which dimensions of their character were trained. Each tag adds 1 point to the respective stat, generating a dynamic radar/spider chart:
*   **Focus (Mental Clarity):** Trained via meditation, reading, and deep work.
*   **Discipline (Willpower):** Trained by showing up regardless of mood, taking cold showers, and journaling.
*   **Endurance (Stamina):** Trained via physical exercise, running, fasting, and prolonged studying.
*   **Wisdom (Knowledge):** Trained via coding, writing, language learning, and skill practice.
*   **Vitality (Recovery):** Trained via sleep tracking, stretching, and nutrition.

---

## Technology Stack

The application leverages a robust, portfolio-grade modern frontend architecture:

*   **Core Framework:** React 18 + Vite
*   **State Management:** Zustand (configured with local persistence middleware)
*   **Styles & Theme:** Tailwind CSS v4 (configured via CSS custom properties and theme extensions)
*   **Visualizations:** Recharts (responsive radar charts mapping character stats)
*   **Animations:** Framer Motion (handling Level-Up/Rank-Up ceremonies and transition physics)
*   **Date Orchestration:** date-fns (providing lightweight, timezone-agnostic local date validation)
*   **Utility Assets:** Lucide React (geometric UI iconography)
*   **Testing Suite:** Vitest + React Testing Library + JSDOM

---

## Directory Architecture

The repository enforces a strict, modular separation of concerns in accordance with Section 8 of the product requirements:

```
solo-quest/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable primitive UI elements (Button, Card, Modal)
│   │   ├── dashboard/       # Core layout screens, Hunter Card, and XP Progress bars
│   │   ├── checkin/         # Step-by-step Check-in Modal and Reward burst screens
│   │   ├── ceremonies/      # Full-screen Level-Up and Rank-Up animated overlays
│   │   ├── journal/         # Chronological log filtering and historical summaries
│   │   ├── stats/           # Stat analysis panels and Recharts radar layouts
│   │   ├── onboarding/      # Welcome views and quest name/why configuration steps
│   │   └── settings/        # Appearance controls, local storage resets, and exports
│   ├── store/
│   │   ├── useGameStore.ts  # Main Zustand store featuring persistence middleware
│   │   └── types.ts         # Canonical TypeScript interfaces
│   ├── lib/
│   │   ├── xp.ts            # Mathematical formulations for check-in XP calculation
│   │   ├── levels.ts        # Level curves and threshold progress logic
│   │   ├── ranks.ts         # Consistency check gates and rank evaluations
│   │   ├── streaks.ts       # Streak milestones and manual freeze grace triggers
│   │   ├── achievements.ts  # Validation engine for badges and achievements
│   │   └── dates.ts         # Local date string converters using date-fns
│   ├── constants/
│   │   ├── ranks.ts         # Configuration parameters for E through SSS ranks
│   │   ├── achievements.ts  # Definitions for the 20 core and 5 hidden badges
│   │   └── stats.ts         # Static descriptions for the five core dimensions
│   ├── App.tsx              # Application shell
│   └── main.tsx             # Application entrypoint
├── index.html               # Main template importing Google Fonts (Orbitron, Sora)
├── vite.config.ts           # Bundler config extending Tailwind and Vitest
├── tsconfig.json            # Reference TypeScript compiler config
└── tsconfig.app.json        # Application-specific strict mode compiler rules
```

---

## Installation and Setup

### Prerequisites
*   Node.js (version 18.0.0 or higher)
*   npm (version 9.0.0 or higher)

### Setup Instructions
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/rafinazhminugraha/Solo.git
    cd Solo
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will run locally on `http://localhost:5173/` with active Hot Module Replacement (HMR).

4.  **Execute TypeScript Compilation Check**
    ```bash
    npx tsc --noEmit
    ```

5.  **Run Tests**
    ```bash
    npm run test
    ```

6.  **Build for Production**
    ```bash
    npm run build
    ```
    Production assets will be output to the `/dist` directory.

---

## Future Roadmap (Version 2.0+)
*   **Supabase Cloud Synchronization:** Magic link authentication and real-time backend backup.
*   **Multi-Quest Unlocks:** Allowing players who reach Rank S (Sovereign) to track multiple commitments simultaneously.
*   **Prestige Loop:** Allowing SSS-Rank Immortals to reset back to Rank E in exchange for a permanent prestige badge.
*   **Boss Battles:** Weekly high-difficulty challenges designed to test commitment and yield bonus experience.
