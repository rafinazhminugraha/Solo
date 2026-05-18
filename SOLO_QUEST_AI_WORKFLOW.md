# SOLO QUEST — Ultimate AI-Assisted Development Workflow
**Version:** 1.0.0  
**Based on:** SOLO_QUEST_PRD.md v1.0.0  
**Stack:** React 18 + Vite + TypeScript + Tailwind CSS v4 + Zustand + Framer Motion

---

## HOW TO USE THIS DOCUMENT

This workflow is a complete, sequential, phase-by-phase build guide. Each phase contains:
- **Context** — what you're building and why
- **Full Prompt(s)** — copy-paste into your AI IDE chat (Cursor, Windsurf, Copilot, etc.)
- **Checklist** — verify everything before moving to the next phase

**Never skip a phase.** Each phase's output is a dependency for the next. If a checklist item fails, fix it before proceeding.

---

## MASTER SESSION PRIMER

> **Paste this at the start of EVERY new IDE chat session, before any other prompt.**

```
You are my AI coding assistant for the Solo Quest project. Before doing anything else, read the file `SOLO_QUEST_PRD.md` in the root of this project. This file is the single source of truth for everything we are building — features, mechanics, data models, component architecture, UX flows, visual design system, and game logic formulas.

Rules you must follow throughout this entire project:
1. Every decision — naming, logic, UI text, colors, animations — must be traceable to the PRD. If it's not in the PRD, tell me before inventing it.
2. The TypeScript interfaces in Section 7 of the PRD are canonical. Never deviate from them without flagging it.
3. The XP formula, level curve, rank evaluation logic, and streak rules in Section 4 are exact specifications. Implement them precisely as written — do not simplify or approximate.
4. The file/folder structure in Section 8 is the required architecture. Follow it exactly.
5. The color palette, typography, and animation principles in Section 10 are required design specifications. Do not substitute alternatives.
6. XP is NEVER subtracted for any reason. This is the core philosophical rule of the app.
7. All dates use local time with 'YYYY-MM-DD' format via date-fns. Never use UTC for streak logic.
8. The tech stack is: React 18 + Vite + TypeScript + Tailwind CSS v4 + Zustand + Framer Motion + Recharts + Lucide React + date-fns. Do not add libraries outside this list without asking.

Confirm you have read the PRD and summarize: (a) the app's core philosophy in one sentence, (b) the XP formula, (c) the rank evaluation method, (d) the localStorage key used for persistence.
```

---

## PHASE 0 — Project Scaffolding & Environment Setup

### Context

Establish the exact project structure, install all dependencies, configure TypeScript strict mode, set up Tailwind v4, and verify the dev server runs. Nothing is built yet — this phase is about getting a clean, correctly configured foundation.

---

### Prompt 0.1 — Project Initialization

```
Create the Solo Quest project using the exact setup commands from the PRD Section 6. Run these commands and confirm success:

npm create vite@latest solo-quest -- --template react-ts
cd solo-quest
npm install tailwindcss @tailwindcss/vite
npm install zustand framer-motion recharts lucide-react date-fns nanoid
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitest/coverage-v8

After installing, do the following:
1. Configure Tailwind CSS v4 by adding the @tailwindcss/vite plugin to vite.config.ts and adding `@import "tailwindcss"` to src/index.css. Remove all default Vite CSS content.
2. Update tsconfig.json to enable strict mode: set "strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true.
3. Update vite.config.ts to add the test configuration block for Vitest with jsdom environment.
4. Clean src/App.tsx to just render a <div> with text "Solo Quest — Loading..." so we know it compiles.
5. Run `npm run dev` and confirm no errors.

Show me the final contents of: vite.config.ts, tsconfig.json, src/index.css, and src/App.tsx.
```

---

### Prompt 0.2 — Folder Structure & Google Fonts

```
Create the complete folder structure for Solo Quest as specified in PRD Section 8. Create empty placeholder files (with a single comment `// TODO`) in each location so the structure is committed:

src/
  components/
    ui/              → Button.tsx, Card.tsx, Modal.tsx
    dashboard/       → DashboardScreen.tsx, HunterCard.tsx, XPBar.tsx
    checkin/         → CheckInModal.tsx, RewardScreen.tsx
    ceremonies/      → LevelUpCeremony.tsx, RankUpCeremony.tsx
    journal/         → JournalScreen.tsx, JournalEntry.tsx
    stats/           → StatsScreen.tsx, RadarChart.tsx
    onboarding/      → OnboardingFlow.tsx, steps/ (Step1.tsx through Step5.tsx)
    settings/        → SettingsScreen.tsx
  store/
    useGameStore.ts
    types.ts
  lib/
    xp.ts
    levels.ts
    ranks.ts
    streaks.ts
    achievements.ts
    dates.ts
  constants/
    ranks.ts
    achievements.ts
    stats.ts

Then update index.html to load the Google Fonts specified in PRD Section 10:
- Orbitron (weights 400, 700, 900)
- Sora (weights 400, 500, 600)
- JetBrains Mono (weights 400, 500)

Add the CSS custom properties from PRD Section 10 (the full :root block with all --bg-*, --text-*, --accent-*, --rank-*, --font-* variables) to src/index.css.

Confirm structure is correct by listing all created files.
```

---

### Phase 0 Checklist

- [ ] `npm run dev` starts with zero errors and zero TypeScript errors
- [ ] `npm run build` completes successfully
- [ ] `tsconfig.json` has `"strict": true` confirmed
- [ ] Tailwind v4 is configured — test by adding a `className="bg-red-500"` to App.tsx and verifying it renders red
- [ ] All folders and placeholder files exist per the structure above
- [ ] `index.html` loads Orbitron, Sora, and JetBrains Mono from Google Fonts
- [ ] `src/index.css` contains the full CSS variables block from PRD Section 10
- [ ] `nanoid` and `date-fns` are in `node_modules`
- [ ] Vitest config is present in `vite.config.ts`
- [ ] No `node_modules` or build artifacts committed to git (`.gitignore` present)

---

## PHASE 1 — TypeScript Types & Constants

### Context

Define every TypeScript interface exactly as specified in PRD Section 7, and populate all constants arrays (ranks, achievements, stats). This phase produces zero UI — only pure data definitions. These types are the backbone of every future module.

---

### Prompt 1.1 — All TypeScript Interfaces

```
Implement the complete TypeScript type definitions in src/store/types.ts. Copy them exactly from PRD Section 7. Include every interface and type:

- Quest (with QuestCategory type)
- CheckIn
- StatKey (union type)
- BonusEvent (with BonusEvent['type'] union)
- StreakState
- PlayerStats
- RankKey (union type)
- RankDefinition (with auraType union)
- AchievementDefinition (with checkCondition signature: (state: GameState) => boolean)
- EarnedAchievement
- GameState (root store type)
- PendingCeremony
- UserSettings

Additional types needed (not in PRD but required for implementation):
- ComputedStats: derived from GameState at runtime (level, xp progress, consistency score, rank)
- AppView: 'dashboard' | 'journal' | 'stats' | 'settings' — for navigation state

Make all interfaces exportable. Do not add any properties not in the PRD. Do not change any property names or types. Use strict TypeScript — no `any`.

After writing types.ts, show me the complete file content.
```

---

### Prompt 1.2 — Rank Constants

```
Implement src/constants/ranks.ts. Create and export RANK_DEFINITIONS as a readonly array of RankDefinition objects. Use exactly the values from PRD Section 4.3 rank table:

| Rank | Title              | minConsistency | minLevel | color   | auraType    |
|------|--------------------|---------------|----------|---------|-------------|
| E    | Ordinary Human     | 0             | 1        | #6B7280 | none        |
| D    | Hunter Initiate    | 30            | 5        | #22C55E | pulse       |
| C    | Proven Hunter      | 50            | 15       | #3B82F6 | glow        |
| B    | Elite Hunter       | 65            | 30       | #A855F7 | ring        |
| A    | Shadow Hunter      | 78            | 50       | #F59E0B | flare       |
| S    | Sovereign          | 88            | 70       | #EF4444 | shockwave   |
| SS   | Monarch            | 95            | 85       | #F97316 | flame       |
| SSS  | Immortal           | 99            | 95       | #FFFFFF | prismatic   |

For glowColor, derive a 40% opacity rgba version of each rank's color (e.g., E: 'rgba(107,114,128,0.4)').

Order the array E → SSS. Export it as `const RANK_DEFINITIONS: readonly RankDefinition[]`.
```

---

### Prompt 1.3 — Achievement Constants

```
Implement src/constants/achievements.ts. Create and export ACHIEVEMENT_DEFINITIONS as a readonly array of AchievementDefinition objects. Implement all 20 standard achievements (A-01 through A-20) and all 5 hidden achievements from PRD Section 4.7.

For each achievement, implement the checkCondition function. Use the GameState type from types.ts. The function receives the current full game state and returns true if the achievement is earned.

Key conditions to implement correctly:
- A-01 (First Blood): state.checkIns.length >= 1
- A-03 (Week One): state.streak.current >= 7 OR state.streak.longest >= 7
- A-05 (Century Mark): state.streak.longest >= 100
- A-06 (Reflective): state.checkIns.filter(c => c.note !== null).length >= 10
- A-08 through A-11 (Rank badges): computed rank from state must match
- A-12 (Comeback King): need to detect 3 consecutive check-ins after a streak break — add a `comebackCheckInsCompleted` counter to GameState or derive it from checkIn history
- A-14 (Stat Master): any single stat in state computed statPoints reaches 50
- A-15 (Balanced Hunter): all 5 stats above 10
- A-16 (Year One): state.checkIns.length >= 365
- A-17 (Frozen in Time): state.streak.freezesUsed >= 1
- A-18 (Ice Vault): state.streak.freezesAvailable >= 3
- A-19 (The Why): state.quest?.why is a non-empty string
- A-20 (Midnight Hunter): any check-in timestamp is between 23:00 and 23:59 local time

Hidden achievements:
- Ghost Protocol: any check-in timestamp is exactly at 00:00 (midnight)
- The Grind: 30 check-ins all have notes
- Unmovable: 50-day streak with freezesUsed === 0 at time of check
- Phoenix: after a full reset, new longest streak exceeds previous (need to track pre-reset longest)
- Beyond Limits: level >= 75

Show the complete file.
```

---

### Prompt 1.4 — Stats Constants

```
Implement src/constants/stats.ts. Define and export STAT_DEFINITIONS as a readonly array. Each entry has:
- key: StatKey
- label: string (e.g., "FOCUS")
- symbol: string (the emoji from PRD Section 4.5)
- description: string (the "Represents" column from PRD)
- exampleQuests: string[] (the examples from PRD)

Use exactly the 5 stats from PRD Section 4.5: FOCUS (🧠), DISCIPLINE (⚔️), ENDURANCE (🔥), WISDOM (📖), VITALITY (💎).

Also export the QUEST_CATEGORIES constant with the 6 categories from onboarding (PRD Section 5.1):
- mind, body, skill, create, health, custom
Each with: key, label, icon (emoji), color (pick a distinct color per category).
```

---

### Phase 1 Checklist

- [ ] `src/store/types.ts` compiles with zero TypeScript errors
- [ ] Every interface from PRD Section 7 is present and matches exactly
- [ ] `GameState` includes `version: number` field
- [ ] `RankDefinition.auraType` matches the exact union: `'none' | 'pulse' | 'glow' | 'ring' | 'flare' | 'shockwave' | 'flame' | 'prismatic'`
- [ ] `RANK_DEFINITIONS` has exactly 8 entries (E through SSS)
- [ ] `ACHIEVEMENT_DEFINITIONS` has exactly 25 entries (20 standard + 5 hidden)
- [ ] All `checkCondition` functions are implemented (not left as `() => false`)
- [ ] `STAT_DEFINITIONS` has exactly 5 entries
- [ ] `QUEST_CATEGORIES` has exactly 6 entries
- [ ] No `any` types used anywhere in these files
- [ ] Run `npx tsc --noEmit` — zero errors

---

## PHASE 2 — Core Game Logic Modules

### Context

Implement the pure logic functions that power the game engine. These are stateless — they take inputs and return outputs, no side effects. They must match the PRD formulas exactly. All must be unit-tested.

---

### Prompt 2.1 — XP Logic

```
Implement src/lib/xp.ts based on PRD Section 4.1 and Appendix A. Implement and export these functions:

1. calculateStreakMultiplier(streak: number): number
   Formula: 1.0 + Math.min(streak / 100, 1.0)
   Cap: max 2.0x

2. calculateCheckInXP(streak: number, hasNote: boolean, statCount: number): number
   Formula from PRD Appendix A:
   base = 100
   multiplier = calculateStreakMultiplier(streak)
   noteBonus = hasNote ? 10 : 0
   statBonus = statCount * 5
   return Math.round(base * multiplier) + noteBonus + statBonus
   Max possible: 235 XP/day

3. calculateStreakMilestoneBonus(streakDays: number): number | null
   Returns the bonus XP for streak milestones from PRD Section 4.4:
   7 → 100, 14 → 150, 30 → 300, 60 → 400, 100 → 500, 200 → 700, 365 → 2000
   Returns null if not a milestone day.

4. isComebackActive(streak: StreakState): boolean
   Returns streak.inComebackMode && streak.comebackDaysRemaining > 0

5. applyComebackBonus(baseXP: number): number
   Returns Math.round(baseXP * 1.2) — the +20% comeback bonus

Then create src/lib/xp.test.ts and write Vitest unit tests:
- calculateStreakMultiplier(0) === 1.0
- calculateStreakMultiplier(50) === 1.5
- calculateStreakMultiplier(100) === 2.0
- calculateStreakMultiplier(200) === 2.0 (capped)
- calculateCheckInXP(0, false, 0) === 100
- calculateCheckInXP(100, true, 5) === 235 (max case)
- calculateCheckInXP(10, false, 0) === 110
- calculateStreakMilestoneBonus(7) === 100
- calculateStreakMilestoneBonus(8) === null
- calculateStreakMilestoneBonus(365) === 2000

Run tests with `npm run test` and confirm all pass. Show the test output.
```

---

### Prompt 2.2 — Level Logic

```
Implement src/lib/levels.ts based on PRD Section 4.2. Implement and export:

1. xpForLevel(level: number): number
   Formula: if level <= 1 return 0; else return Math.round(100 * Math.pow(level, 1.8))

2. levelFromXP(totalXP: number): number
   Iterate from level 1 upward until xpForLevel(level + 1) > totalXP.
   Cap at 100.
   Must be O(100) worst case — iterate to 100 at most.

3. xpProgressInLevel(totalXP: number): { current: number; required: number }
   Returns XP earned within the current level and XP needed to reach the next level.
   current = totalXP - xpForLevel(currentLevel)
   required = xpForLevel(currentLevel + 1) - xpForLevel(currentLevel)
   At level 100, required = 0 (max level reached).

4. estimateDaysToNextLevel(totalXP: number, avgXPPerDay: number): number | null
   Returns null if at level 100 or if avgXPPerDay <= 0.
   Returns Math.ceil(xpProgressInLevel(totalXP).required - xpProgressInLevel(totalXP).current) / avgXPPerDay

5. getLevelLabel(level: number): string
   Returns the label from the PRD level table:
   1 → "Awakened", 5 → "Initiate", 10 → "Seeker", 20 → "Challenger",
   30 → "Veteran", 40 → "Elite", 50 → "Master", 60 → "Grandmaster",
   75 → "Legend", 90 → "Mythic", 100 → "Transcendent"
   For levels between milestones, return the label of the nearest lower milestone.

Write unit tests in src/lib/levels.test.ts:
- xpForLevel(1) === 0
- xpForLevel(10) === 6310 (verify against PRD table: 6310)
- xpForLevel(50) === 109657 (verify: 109657)
- levelFromXP(0) === 1
- levelFromXP(6309) === 9 (just below level 10)
- levelFromXP(6310) === 10 (exactly level 10)
- levelFromXP(398107) === 100
- xpProgressInLevel(6310) returns { current: 0, required: (xpForLevel(11) - xpForLevel(10)) }

Run tests. Confirm all pass. Show output.
```

---

### Prompt 2.3 — Rank Logic

```
Implement src/lib/ranks.ts based on PRD Section 4.3. Implement and export:

1. calculateConsistency(totalCheckIns: number, totalDays: number): number
   Formula: if totalDays < 14 return 0
   else return Math.min(100, Math.round((totalCheckIns / totalDays) * 100))

2. evaluateRank(level: number, consistency: number): RankKey
   Algorithm from PRD Section 8 component architecture:
   - Filter RANK_DEFINITIONS where level >= r.minLevel AND consistency >= r.minConsistency
   - Sort descending by minConsistency (most demanding first)
   - Return first match's key, or 'E' if none match
   Import RANK_DEFINITIONS from constants/ranks.ts.

3. getRankDefinition(rank: RankKey): RankDefinition
   Returns the matching entry from RANK_DEFINITIONS.

4. canRankUp(currentRank: RankKey, level: number, consistency: number): boolean
   Returns true if evaluateRank(level, consistency) would result in a higher rank than currentRank.
   Use rank order: E < D < C < B < A < S < SS < SSS.

5. RANK_ORDER: readonly RankKey[]
   Export the ordered array: ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS']

Write unit tests in src/lib/ranks.test.ts:
- calculateConsistency(7, 7) === 0 (< 14 days)
- calculateConsistency(14, 14) === 100
- calculateConsistency(7, 14) === 50
- evaluateRank(1, 0) === 'E'
- evaluateRank(5, 30) === 'D'
- evaluateRank(15, 50) === 'C'
- evaluateRank(50, 78) === 'A'
- evaluateRank(95, 99) === 'SSS'
- evaluateRank(95, 95) returns 'SS' (not SSS — 99% not met)

Run tests. Confirm all pass.
```

---

### Prompt 2.4 — Date & Streak Logic

```
Implement src/lib/dates.ts and src/lib/streaks.ts.

--- dates.ts ---
All functions use date-fns. Export:

1. getTodayDateString(): string
   Returns format(new Date(), 'yyyy-MM-dd') — local time always

2. isToday(dateStr: string): boolean
   Returns getTodayDateString() === dateStr

3. getDaysDifference(dateA: string, dateB: string): number
   Parse both with parseISO, return differenceInCalendarDays(dateA, dateB)
   Note: calendar days, not 24-hour periods

4. isConsecutiveDay(prevDate: string, nextDate: string): boolean
   Returns getDaysDifference(nextDate, prevDate) === 1

5. formatDisplayDate(dateStr: string): string
   Returns format(parseISO(dateStr), 'MMM d, yyyy')

--- streaks.ts ---
Export:

1. calculateNewStreakState(
     currentStreak: StreakState,
     today: string,
     isCheckIn: boolean
   ): StreakState
   
   Logic:
   - If isCheckIn:
     - If lastCheckInDate === null (first ever): new streak = 1
     - If isConsecutiveDay(lastCheckInDate, today): increment current by 1
     - If lastCheckInDate === today: no change (idempotent — already checked in)
     - Otherwise (gap > 1 day): reset current to 1, but preserve longest
     - Update longest if new current > longest
     - Decrement comebackDaysRemaining if > 0
     - Update lastCheckInDate to today
   - If !isCheckIn (missed day detected on app open):
     - If today is more than 1 day after lastCheckInDate AND freeze is not active for the gap:
       - Reset current streak to 0
       - Activate comeback mode (inComebackMode = true, comebackDaysRemaining = 3)
   
2. checkFreezeEligibility(streak: StreakState, today: string): boolean
   Returns true if:
   - freezesAvailable > 0
   - lastCheckInDate is 1 or 2 days before today (within the 48h grace window from PRD Section 11)

3. applyFreeze(streak: StreakState, forDate: string): StreakState
   Returns updated streak with:
   - freezesAvailable -= 1
   - freezesUsed += 1
   - freezeActivatedForDate = forDate
   - Does NOT change current streak (freeze preserves it)

4. awardFreezeIfEligible(streak: StreakState): StreakState
   At 7-day streak milestones (7, 14, 21, 28...): add 1 freeze if < 3.
   Check: current % 7 === 0 AND current > 0 AND freezesAvailable < 3

Write comprehensive unit tests in src/lib/streaks.test.ts covering:
- First check-in sets streak to 1
- Consecutive check-in increments streak
- Same-day check-in is idempotent (no change)
- Gap > 1 day resets streak to 1 (not 0 — new streak starts)
- Comeback mode activates after gap
- Freeze correctly preserves streak
- Freeze grace period (48h) is respected
- Freeze award at day 7, 14, 21

Run tests. Confirm all pass.
```

---

### Prompt 2.5 — Achievement Engine

```
Implement src/lib/achievements.ts. Export:

1. computeStatPoints(checkIns: CheckIn[]): Record<StatKey, number>
   Aggregate all statsTagged across all check-ins.
   Return { focus: N, discipline: N, endurance: N, wisdom: N, vitality: N }

2. checkAchievements(
     state: GameState,
     computedStats: Record<StatKey, number>,
     currentLevel: number,
     currentRank: RankKey
   ): AchievementDefinition[]
   
   Runs all ACHIEVEMENT_DEFINITIONS[n].checkCondition(state) where achievementId is NOT already in state.earnedAchievements.
   Returns array of newly earned AchievementDefinition objects.
   
   IMPORTANT: The checkCondition in achievements.ts constants uses GameState directly. But level and rank are computed values, not stored in GameState. Augment the state passed to checkCondition with a synthetic field or compute them inline before passing. Design this so no circular dependency is created.

3. buildEarnedAchievement(def: AchievementDefinition): EarnedAchievement
   Returns { achievementId: def.id, earnedAt: new Date().toISOString() }

Write unit tests in src/lib/achievements.test.ts:
- A-01 triggers when checkIns.length === 1
- A-01 does NOT trigger if already in earnedAchievements
- A-19 triggers when quest.why is a non-empty string
- A-06 triggers when 10+ check-ins have non-null notes
- computeStatPoints correctly aggregates multi-stat check-ins
```

---

### Phase 2 Checklist

- [ ] `npm run test` passes 100% — all test files pass with no failures
- [ ] `xp.test.ts`: all 10+ cases pass including the 235 XP max case
- [ ] `levels.test.ts`: xpForLevel(10) === 6310 and xpForLevel(50) === 109657 confirmed
- [ ] `ranks.test.ts`: evaluateRank(95, 99) === 'SSS' and evaluateRank(95, 95) === 'SS' both confirmed
- [ ] `streaks.test.ts`: idempotency test passes (same-day check-in does not change streak)
- [ ] `streaks.test.ts`: freeze 48h grace period test passes
- [ ] `achievements.test.ts`: already-earned check prevents double-awarding
- [ ] No `any` types in any lib file
- [ ] All functions are pure (no side effects, no state mutations)
- [ ] `npx tsc --noEmit` — zero errors

---

## PHASE 3 — Zustand Store

### Context

Wire up the global state store using Zustand with localStorage persistence. All game actions flow through this store. The store computes derived values (level, rank, stats) on the fly from raw state.

---

### Prompt 3.1 — Store Implementation

```
Implement src/store/useGameStore.ts. This is the central Zustand store for Solo Quest.

Use: import { create } from 'zustand'; import { persist } from 'zustand/middleware';
Storage key: 'solo-quest-v1' (from PRD Section 7).
Current schema version: 1.

The store state is GameState (from types.ts) plus actions.

Define the initial state:
```typescript
const INITIAL_STATE: GameState = {
  version: 1,
  quest: null,
  checkIns: [],
  streak: {
    current: 0,
    longest: 0,
    lastCheckInDate: null,
    freezesAvailable: 0,
    freezesUsed: 0,
    freezeActivatedForDate: null,
    inComebackMode: false,
    comebackDaysRemaining: 0,
  },
  earnedAchievements: [],
  hasCompletedOnboarding: false,
  pendingCeremony: null,
  settings: {
    theme: 'dark',
    reminderTime: null,
    reminderEnabled: false,
  },
};
```

Implement these actions on the store:

1. completeOnboarding(quest: Omit<Quest, 'id' | 'createdAt'>): void
   - Set quest with generated id (nanoid()) and createdAt (new Date().toISOString())
   - Set hasCompletedOnboarding to true
   - If quest.why is non-empty, award 25 XP as a BonusEvent (type 'first_checkin', label "Set your why")
   - Check achievements, award any triggered ones
   - Note: for the "why bonus" XP, you need to add it to total XP. Since XP is only stored in check-ins, create a synthetic first check-in entry OR store a `bonusXP` field. Design decision: add a `bonusXPEvents: BonusEvent[]` array to GameState for one-time bonuses not tied to check-ins, and sum them in the computed totalXP.

2. performCheckIn(note: string | null, statsTagged: StatKey[]): void
   This is the most critical action. Sequence:
   a. Get today's date string
   b. Verify not already checked in today (idempotency guard — if checkIns[last].date === today, return early)
   c. Calculate new streak state using calculateNewStreakState
   d. Award freeze if eligible using awardFreezeIfEligible
   e. Calculate XP: base XP using calculateCheckInXP(newStreak.current, !!note, statsTagged.length)
   f. Apply comeback bonus if isComebackActive(newStreak)
   g. Calculate milestone bonus using calculateStreakMilestoneBonus(newStreak.current)
   h. Build bonusEvents array
   i. Calculate level BEFORE check-in (for level-up detection)
   j. Calculate rank BEFORE check-in (for rank-up detection)
   k. Add check-in to checkIns array with all computed values
   l. Calculate level AFTER — if higher, set pendingCeremony to { type: 'level_up', previousValue: oldLevel, newValue: newLevel }
   m. Calculate rank AFTER — if higher, set pendingCeremony (or queue second ceremony if both)
   n. Check and award achievements
   o. Update streak state in store

3. activateFreeze(): void
   - Call checkFreezeEligibility — if false, return early
   - Determine the date to protect (yesterday if missed)
   - Call applyFreeze
   - Update streak in store

4. clearPendingCeremony(): void
   Sets pendingCeremony to null.

5. updateSettings(partial: Partial<UserSettings>): void
   Merges partial into settings.

6. resetStreak(): void
   Resets only streak.current to 0. XP untouched. Confirms with a flag (do not reset without explicit user action).

7. fullReset(): void
   Returns store to INITIAL_STATE. Used for Settings > Full Reset.

Selectors (computed values, not stored):

Export a separate hook: useComputedStats(): PlayerStats that derives:
- totalXP: sum of all checkIn.xpEarned + bonusXPEvents XP
- level: levelFromXP(totalXP)
- xpInCurrentLevel / xpToNextLevel: from xpProgressInLevel
- rank: evaluateRank(level, consistencyScore)
- consistencyScore: calculateConsistency(totalCheckIns, totalDaysSinceStart)
- totalCheckIns: checkIns.length
- totalDaysSinceStart: days since quest.createdAt
- statPoints: computeStatPoints(checkIns)

Also add schema migration logic: on hydration, if stored state.version < CURRENT_VERSION, run migration. Version 1 → 2 migration should be a no-op (future placeholder).

Show complete useGameStore.ts and confirm it compiles with zero errors.
```

---

### Prompt 3.2 — Store Validation

```
Write integration tests for the Zustand store in src/store/useGameStore.test.ts.

Since Zustand stores can be tested with @testing-library/react's renderHook, implement these test cases:

1. Initial state: hasCompletedOnboarding === false, quest === null
2. After completeOnboarding: quest is set, hasCompletedOnboarding === true
3. completeOnboarding with why: totalXP from useComputedStats() includes the 25 bonus
4. performCheckIn: check-in added to checkIns array, streak increments
5. Idempotency: calling performCheckIn twice on same day does not add a second check-in
6. XP never goes down: after any action, totalXP from previous state is always <= new totalXP
7. Level-up detection: mock enough XP that a level-up occurs, verify pendingCeremony is set
8. clearPendingCeremony: sets pendingCeremony back to null
9. activateFreeze: decrements freezesAvailable by 1, increments freezesUsed
10. fullReset: returns to initial state

Run all tests. Confirm they pass.
```

---

### Phase 3 Checklist

- [ ] `useGameStore.ts` compiles with zero TypeScript errors
- [ ] `npx tsc --noEmit` — zero errors across all files
- [ ] Store integration tests pass (all 10 cases)
- [ ] Idempotency test confirmed — double check-in does NOT create duplicate entry
- [ ] XP never-goes-down invariant is tested and confirmed
- [ ] `pendingCeremony` is correctly set on level-up
- [ ] `pendingCeremony` is cleared after `clearPendingCeremony()`
- [ ] Persistence works: open browser console, check `localStorage.getItem('solo-quest-v1')` returns valid JSON after performing a test action
- [ ] `fullReset()` truly resets — no leftover state
- [ ] Schema version field is present in stored JSON
- [ ] No `any` types in store file

---

## PHASE 4 — Onboarding Flow (5 Screens)

### Context

The first-run experience. This is the emotional hook of the app. Every screen must follow PRD Section 5.1 exactly. This is also the first phase where the design system (Section 10) is applied visually.

---

### Prompt 4.1 — Reusable UI Primitives

```
Build the reusable UI components in src/components/ui/ before any screens.

1. Button.tsx
   Props: variant ('primary' | 'secondary' | 'ghost' | 'danger'), size ('sm' | 'md' | 'lg'), children, onClick, disabled, fullWidth
   - Primary: bg accent-primary (#F59E0B) text, with glow effect on hover using box-shadow rgba(245,158,11,0.4)
   - Secondary: border accent-primary, transparent bg
   - Ghost: no border, subdued text
   - Danger: red (#EF4444) variant
   - All use Sora font, rounded-lg
   - Include a pulsing animation class that can be toggled via prop `isPulsing`
   - Use Framer Motion for press animation: whileTap scale 0.97

2. Card.tsx
   Props: children, className, elevated (boolean — uses --bg-elevated), glow (RankKey | null — adds colored border glow)
   - Default bg: --bg-card (#12121A)
   - Elevated bg: --bg-elevated (#1A1A26)
   - Glow: box-shadow using rank color at 40% opacity
   - rounded-xl, border border-white/5

3. Modal.tsx
   Props: isOpen, onClose, children, title, fullScreen
   - Backdrop: black/60 with blur
   - Slides up from bottom using Framer Motion: initial y: 100, animate y: 0, spring easing
   - fullScreen variant: covers entire viewport (for ceremonies)
   - Locks body scroll when open

4. ProgressBar.tsx
   Props: current, max, colorVar (CSS variable name), height, showLabel, animated
   - Uses the XP bar gradient from PRD: linear-gradient(90deg, #3B82F6, #A855F7, #F59E0B)
   - Animated: Framer Motion width spring on mount and value change (800ms spring)
   - Glow pulse at full (when current === max)
   - Shows percentage or X/Y label based on showLabel

Show all 4 component files.
```

---

### Prompt 4.2 — Onboarding Flow

```
Build the complete 5-screen onboarding flow in src/components/onboarding/.

Create OnboardingFlow.tsx as the parent component that manages the current step (1–5) with state. Each step is a full-screen view. Use Framer Motion AnimatePresence for slide transitions between steps.

Step 1 (Step1Welcome.tsx):
- Full screen dark background (#0A0A0F)
- Particle field background: create using a CSS animation approach — ~30 small dots positioned absolutely with staggered float/fade animations using Tailwind's arbitrary values or inline styles. No canvas required.
- Centered vertically and horizontally:
  - "SOLO QUEST" in Orbitron font, large (text-5xl md:text-7xl), letter-spacing wide, color --text-primary
  - Tagline below: "One quest. One you. Every day." in Sora, text-lg, --text-secondary
  - "Begin Your Journey" button (primary variant, with glowing border animation)

Step 2 (Step2Quest.tsx):
- Header: "What will you do every single day?" (Orbitron, text-2xl, --text-primary)
- Large autofocused text input (styled with --bg-input bg, --accent-primary border on focus, Sora font, text-xl)
- Below: 6 category pill buttons in a flex-wrap grid using QUEST_CATEGORIES constant
  - Each pill: icon + label, colored border matching category color
  - Selected state: filled with category color
- Validation: quest name must be non-empty to proceed
- "Continue" button (disabled until name entered)

Step 3 (Step3Why.tsx):
- Header: "Why does this matter to you?"
- Subtext: "Your 'why' is stored privately. It fuels your quest." (--text-secondary)
- Multiline textarea (3–4 rows, same styling as Step 2 input)
- "Skip" link and "Continue" button both available
- Small note: "Completing this awards +25 XP" (--accent-primary color)

Step 4 (Step4Rank.tsx):
- Display large rank glyph "E" in --rank-e color (Orbitron, text-8xl)
- Below: "ORDINARY HUMAN" in Orbitron, text-xl
- Explanatory paragraph (Sora): "Everyone starts here. The question is where you end."
- Vertical rank ladder showing E → D → C → B → A → S → SS → SSS as small pills (using rank colors from RANK_DEFINITIONS), with E highlighted/active
- "Accept Your Rank" button

Step 5 (Step5Confirmed.tsx):
- Summary card (Card.tsx elevated) showing:
  - Quest name (large, Orbitron)
  - Category icon + label
  - "Your Why" (if set) — quoted, italic
- "Quest Registered" stamp: a Framer Motion animated element that scales in (0 → 1) with a rotation (-15deg → 0) and color flash (#F59E0B), like an ink stamp landing
- XP counter: starts at 0, animates to 25 (why bonus) or 0 using Framer Motion useMotionValue + useSpring
- "Enter the System" button — on click, calls completeOnboarding() from useGameStore, then navigates to Dashboard

Navigation: OnboardingFlow manages step state. Back navigation available from steps 2–5. Progress dots at bottom (5 dots, current highlighted).

If hasCompletedOnboarding === true in store, this flow must never render. App.tsx must gate it.

Show all 6 component files.
```

---

### Phase 4 Checklist

- [ ] All 4 UI primitives render without errors
- [ ] Button `isPulsing` prop creates visible animation
- [ ] Modal slides up from bottom and backdrop blurs correctly
- [ ] ProgressBar gradient matches PRD: blue → purple → amber
- [ ] Onboarding Step 1 loads as the initial screen when `hasCompletedOnboarding === false`
- [ ] Category pills in Step 2 show correct icons and allow single-selection
- [ ] Quest name input is autofocused in Step 2
- [ ] "Continue" in Step 2 is disabled when input is empty
- [ ] Step 3 "Skip" works — passes null for why
- [ ] Step 4 rank ladder shows all 8 ranks in correct order with correct colors
- [ ] Step 5 stamp animation plays on mount
- [ ] XP counter animates from 0 → 25 (if why was entered)
- [ ] "Enter the System" triggers `completeOnboarding()` and navigates to Dashboard
- [ ] If you refresh after completing onboarding, you go directly to Dashboard (not onboarding)
- [ ] No console errors throughout the flow

---

## PHASE 5 — Dashboard Screen

### Context

The main screen users see every day. Must display all key information at a glance and present the check-in CTA prominently. Follows PRD Section 5.2 layout exactly.

---

### Prompt 5.1 — Dashboard Layout

```
Build src/components/dashboard/DashboardScreen.tsx and its sub-components.

The Dashboard is a single scrollable screen. Import useGameStore and useComputedStats for data.

Create these sub-components:

1. HunterCard.tsx (src/components/dashboard/HunterCard.tsx)
   Displays:
   - Rank insignia: a styled glyph showing the current rank letter (e.g., "E", "S") in the rank's color (from RANK_DEFINITIONS), with Orbitron font, large (text-4xl), surrounded by an aura effect div.
   - Rank aura: implemented as a CSS animation class selected based on RankDefinition.auraType:
     - none: no effect
     - pulse: keyframe that oscillates box-shadow opacity 0.3 → 0.8
     - glow: static box-shadow in rank color
     - ring: rotating border via CSS rotate animation
     - flare: radial burst keyframe
     - shockwave: expanding ring keyframe
     - flame: animated gradient halo
     - prismatic: cycling hue-rotate filter animation
   - "RANK: [X] / LEVEL: [N]" in JetBrains Mono, --text-secondary
   - Quest name in Orbitron, text-2xl, --text-primary
   - Category icon + label in Sora, --text-secondary

2. XPBar.tsx (src/components/dashboard/XPBar.tsx)
   Uses ProgressBar.tsx. Shows:
   - ProgressBar with current xpInCurrentLevel / xpToNextLevel
   - Level number prominently (Orbitron, text-6xl, --text-primary) on the left
   - "[current XP] / [required XP] XP" label in JetBrains Mono, small, --text-secondary
   - "Next level in ~N days" estimate if computable (using estimateDaysToNextLevel)
   - Level label text (e.g., "AWAKENED") in Orbitron, small, --text-muted

3. StreakSection.tsx (src/components/dashboard/StreakSection.tsx)
   Shows:
   - "🔥 [N] day streak" with the flame emoji, JetBrains Mono, large
   - "🏆 Longest: [N]" smaller below
   - Freeze icons: 3 ice crystal icons (❄️), filled for available freezes, dimmed for used
   - Long-press on freeze icon activates freeze (use onPointerDown with 800ms timer, onPointerUp to cancel) — show a radial fill animation during the press
   - If inComebackMode: show a "COMEBACK MODE — +20% XP" banner in amber

4. CheckInButton.tsx (src/components/dashboard/CheckInButton.tsx)
   Full-width button, 64px height minimum.
   State A (not checked in today): 
     - Text: "CHECK IN TODAY"
     - Orbitron font, text-xl
     - Pulsing glow animation (3s loop using Framer Motion animate)
     - Background: semi-transparent with --accent-primary border
   State B (checked in today):
     - Text: "Done for today ✓"
     - Muted styling (--bg-card, --text-secondary)
     - No animation
   Determines state by checking if today's date === last check-in date.
   On click (State A): opens CheckInModal.

DashboardScreen.tsx layout (vertical scroll):
```
<div className="min-h-screen" style={{background: 'var(--bg-primary)'}}>
  <nav> {/* App name + settings icon */} </nav>
  <HunterCard />
  <XPBar />
  <StreakSection />
  <CheckInButton onOpenModal={...} />
  <StatsRadarCollapsed /> {/* collapsed by default, expand on tap */}
  <AchievementsRow />
  <RecentJournal />
</div>
```

For StatsRadarCollapsed: a tap-to-expand section using Framer Motion AnimatePresence. Collapsed shows just the section header. Expanded shows a placeholder (we'll wire RadarChart in Phase 7).

For AchievementsRow: horizontal ScrollView showing achievement badges. Unlocked = full color circle with achievement icon emoji. Locked = gray circle with "?" text. Source data from store.earnedAchievements and ACHIEVEMENT_DEFINITIONS.

For RecentJournal: last 3 entries from store.checkIns (reversed). Each shows: date, note preview (truncated at 80 chars), XP earned. "View All" navigates to Journal screen.

Show DashboardScreen.tsx and all sub-components.
```

---

### Phase 5 Checklist

- [ ] Dashboard renders with no errors after completing onboarding
- [ ] HunterCard shows correct rank letter, level, quest name, and category
- [ ] Rank aura animation is visible for non-E ranks (test by temporarily forcing rank to D in store)
- [ ] XP bar fills correctly — set totalXP to a mid-level value and verify bar shows correct proportion
- [ ] Level number displays in Orbitron font
- [ ] Streak shows current and longest values from store
- [ ] Freeze icons: available = visible, used = dimmed. Test with 2 freezes available.
- [ ] CheckInButton pulses when not checked in today
- [ ] CheckInButton shows "Done for today ✓" after a check-in (test by performing a check-in)
- [ ] Long-press on freeze icon starts the radial fill animation and activates freeze after 800ms
- [ ] Comeback mode banner appears when store.streak.inComebackMode === true
- [ ] Achievements row scrolls horizontally
- [ ] Recent Journal shows last 3 entries (or fewer if < 3 check-ins exist)
- [ ] No console errors on Dashboard
- [ ] Dashboard is navigable from onboarding completion

---

## PHASE 6 — Check-In Flow & Reward Screen

### Context

The most-used flow in the entire app. The check-in modal must be fast, satisfying, and reward the user with animations. This is where XP calculation, achievement detection, and ceremony queuing all happen together.

---

### Prompt 6.1 — Check-In Modal

```
Build src/components/checkin/CheckInModal.tsx.

This is a bottom-sheet modal (use Modal.tsx). It has 3 sequential steps managed by local state.

Step 1: Confirmation
- Large text: "Did you complete [questName] today?"
- Large YES button (takes 80% of width, primary variant, full height ~72px)
- Small "No / Use Freeze" button below (ghost variant)
- On YES: advance to Step 2
- On "No / Use Freeze": call activateFreeze() from store if eligible, close modal

Step 2: Stat Tag (optional)
- Header: "What did you train today?" (Sora, text-lg)
- 5 stat pills using STAT_DEFINITIONS — each shows symbol + label
- Multi-select allowed (tap to toggle selected state)
- Selected: filled with --accent-primary background
- "Skip →" text button
- "Next" button (active even with no selection)

Step 3: Note (optional)
- Textarea: "How did it feel? (optional)" placeholder
- maxLength: 200
- Character counter: "X / 200" in --text-muted, JetBrains Mono
- "Submit" button (primary, full-width)
- On submit: call performCheckIn(note, selectedStats) from store, then show RewardScreen

Props: isOpen: boolean, onClose: () => void

Transitions between steps: Framer Motion AnimatePresence with slide-left animation (x: 100% → 0% for entering, 0% → -100% for exiting).

Show CheckInModal.tsx.
```

---

### Prompt 6.2 — Reward Screen

```
Build src/components/checkin/RewardScreen.tsx.

This replaces the check-in modal content after a successful check-in. It is a full-screen overlay (use Modal.tsx with fullScreen prop).

Layout (center-aligned, dark bg):

1. XP Burst Animation
   - "+[N] XP" text (Orbitron, text-5xl, --accent-primary color)
   - Framer Motion: initial { scale: 0.8, opacity: 0 }, animate { scale: [0.8, 1.3, 1.0], opacity: 1 }
   - Duration: 400ms ease-out
   - Fires on mount

2. Streak Counter
   - "🔥 [N] day streak" 
   - If streak incremented: animate the number using Framer Motion useSpring (previous → new value)
   - Slot-machine scroll effect: use a masked overflow div with translateY animation cycling digits

3. Conditional overlays (check store.pendingCeremony after check-in):
   - If pendingCeremony.type === 'level_up': after 1 second, unmount RewardScreen and mount LevelUpCeremony
   - If pendingCeremony.type === 'rank_up': queue after level-up (or immediately if no level-up)

4. Achievement notification (if any new achievements earned this check-in):
   - Small card slides in from the right: "[Badge emoji] Achievement Unlocked: [Name] +[XP] XP"
   - Uses Framer Motion x: 300 → 0 with spring

5. Streak milestone card (if milestone reached):
   - Full-width card with milestone text: "🔥 [N] Day Streak! +[N] XP"

6. Auto-dismiss: after 3 seconds with no interaction, or on tap anywhere, close modal.
   - Show a subtle progress indicator at bottom for the 3s countdown.

Props:
- xpEarned: number
- newStreak: number
- prevStreak: number
- newAchievements: AchievementDefinition[]
- milestoneBonus: number | null
- onDismiss: () => void

Show RewardScreen.tsx.
```

---

### Phase 6 Checklist

- [ ] Check-in modal opens when CheckInButton is tapped (Dashboard State A)
- [ ] Step 1 → Step 2 → Step 3 transitions work with slide animation
- [ ] Multi-stat selection in Step 2 allows selecting 0–5 stats
- [ ] "Skip" in Step 2 proceeds to Step 3 with empty stats
- [ ] Note character counter decrements as user types
- [ ] Submitting calls `performCheckIn()` from store
- [ ] After check-in: store has one new CheckIn entry
- [ ] XP burst animation fires on RewardScreen mount — "+N XP" animates scale
- [ ] Streak number animates from previous to new value
- [ ] Achievement notification slides in if a new achievement was earned
- [ ] Milestone card appears when check-in hits a milestone streak day (test: temporarily set streak to 6, check-in, verify 7-day milestone fires)
- [ ] RewardScreen auto-dismisses after 3 seconds
- [ ] Progress bar counts down 3 seconds visibly
- [ ] After dismissal: Dashboard shows updated XP bar, streak, and updated CheckInButton (State B)
- [ ] Dashboard "Done for today ✓" state persists on page refresh (localStorage working)

---

## PHASE 7 — Ceremonies (Level-Up & Rank-Up)

### Context

The ceremony screens are the emotional pinnacle of the app. They must feel earned, dramatic, and memorable. These fire when `pendingCeremony` is non-null in the store.

---

### Prompt 7.1 — Level-Up Ceremony

```
Build src/components/ceremonies/LevelUpCeremony.tsx.

This is a full-screen overlay that fires when pendingCeremony.type === 'level_up'.

Design (from PRD Section 5.4):
- Background: pulsing dark (#0A0A0F) with a particle shockwave effect
  - Implement as: 8–12 small circles animating outward from center (Framer Motion custom variants with stagger)
- Center sequence (play in order using Framer Motion orchestrated animations):
  
  Phase A (0ms–600ms): Previous level number
  - Show old level number (Orbitron, text-9xl, --text-secondary)
  - Animate: shatters via a CSS clip-path polygon animation, or simpler: scale 1.0 → 1.2, then opacity 1 → 0 with blur filter 0 → 20px
  
  Phase B (600ms–1200ms): New level number emerges
  - New level number (Orbitron, text-9xl, --accent-primary)
  - Animate: blur-to-sharp (filter: blur(20px) → blur(0)), scale 0.5 → 1.0, opacity 0 → 1
  - Light burst: absolute positioned div, radial-gradient white → transparent, scale 0 → 2, opacity 1 → 0 (200ms)
  
  Phase C (1200ms–2000ms): Text reveal
  - "LEVEL [N] ACHIEVED" (Orbitron, text-2xl, --text-primary, letter-spacing widest)
  - "[Quest Name] grows stronger." (Sora, text-sm, --text-secondary)
  - XP bar re-draws for new level (ProgressBar reset to 0, then animates to current overflow amount)
  
  Phase D (2000ms–2500ms): Auto-dismiss
  - Fade out overlay
  - Call clearPendingCeremony()
  - If there is a queued rank-up ceremony, set it as the new pendingCeremony and close this overlay
  - Otherwise, return to Dashboard

The full animation must complete in approximately 2.5 seconds as specified in PRD.

Show LevelUpCeremony.tsx.
```

---

### Prompt 7.2 — Rank-Up Ceremony

```
Build src/components/ceremonies/RankUpCeremony.tsx.

This fires when pendingCeremony.type === 'rank_up'. Uses the new rank's colors and theme.

Design (from PRD Section 5.5):
- Background: dim version of the new rank's color (e.g., for D-rank #22C55E at 10% opacity over #0A0A0F)
- Sequence:

  Phase A (0ms–400ms): Old rank fades out
  - Old rank glyph (Orbitron, text-8xl, old rank color)
  - Framer Motion: opacity 1 → 0, scale 1 → 0.5

  Phase B (400ms–1200ms): New rank glyph materializes
  - New rank glyph (Orbitron, text-8xl, new rank color)
  - Halo: animated ring using box-shadow, scale 0.5 → 1.0, opacity 0 → 1
  - Particle burst: 16 small colored dots exploding outward (Framer Motion custom using custom(), random angle and distance per particle, stagger 30ms)

  Phase C (1200ms–2500ms): Text and CTA
  - "[OLD RANK TITLE] → [NEW RANK TITLE]" (Sora, text-sm, --text-secondary)
  - New rank title large (Orbitron, text-4xl, new rank color, letter-spacing widest)
  - Stats: "You've checked in [N] times. Consistency: [X]%." (Sora, text-sm)
  - CTA button: "Claim Your Rank" (primary variant, new rank color)
  - User MUST tap "Claim Your Rank" to dismiss — does not auto-dismiss
  - On tap: clearPendingCeremony(), return to Dashboard

Show RankUpCeremony.tsx.
```

---

### Prompt 7.3 — Ceremony Orchestration

```
Update App.tsx (or a CeremonyOrchestrator component) to handle ceremony queuing.

Requirements:
1. After a check-in, both a level-up AND a rank-up could occur simultaneously.
2. Sequence: Level-Up ceremony plays FIRST. When it completes and clears, then Rank-Up plays.
3. Implement this by storing ceremonies in order. When both occur, set pendingCeremony to the level-up. When clearPendingCeremony is called, check if a rank-up was also queued and set that as the next pendingCeremony.

In the store, update the pendingCeremony field to be a PendingCeremony[] array (or add a secondaryCeremony: PendingCeremony | null field) to queue the rank-up.

Update performCheckIn() to set both ceremonies in the correct order.

Create src/components/ceremonies/CeremonyGate.tsx:
- Reads pendingCeremony from store
- If pendingCeremony?.type === 'level_up': render <LevelUpCeremony />
- If pendingCeremony?.type === 'rank_up': render <RankUpCeremony />
- Otherwise: render null

Place <CeremonyGate /> in App.tsx as a global overlay layer above everything else.

Show the updated store action, CeremonyGate.tsx, and updated App.tsx.
```

---

### Phase 7 Checklist

- [ ] Level-Up ceremony fires when totalXP crosses a level threshold
- [ ] Level-Up animation sequence plays: old number disappears, new number emerges
- [ ] Animation completes in ~2.5 seconds (time it manually)
- [ ] After Level-Up ceremony: Dashboard shows new level number
- [ ] Rank-Up ceremony fires when rank evaluation increases
- [ ] Rank-Up background uses correct rank color (test all 8 ranks by forcing store rank)
- [ ] Particle burst plays in Rank-Up ceremony
- [ ] "Claim Your Rank" button is required to dismiss Rank-Up (no auto-dismiss)
- [ ] Sequential ceremony: if both level-up and rank-up occur, Level-Up plays first, then Rank-Up
- [ ] After both ceremonies: `pendingCeremony` is null in store
- [ ] Ceremonies do not fire again on page refresh (pendingCeremony correctly cleared and persisted)
- [ ] CeremonyGate renders over everything (z-index is highest in the stack)

---

## PHASE 8 — Journal Screen

### Context

The historical log of every check-in. Allows filtering and searching. Reinforces the permanence of effort.

---

### Prompt 8.1 — Journal Screen

```
Build src/components/journal/JournalScreen.tsx and src/components/journal/JournalEntry.tsx.

JournalEntry.tsx props: checkIn: CheckIn, questName: string
Display:
- Date (formatted via formatDisplayDate from dates.ts) — JetBrains Mono, --text-secondary
- "Day [streakDay]" — small pill badge
- Stat tags: small colored pills for each stat in statsTagged (use stat symbol + key)
- Note: if note !== null, show full note text in Sora, --text-primary
- XP earned: "[N] XP" in --accent-primary, JetBrains Mono, right-aligned
- Bonus events: small row of bonus badges (e.g., "🏆 Achievement +200 XP", "🔥 Milestone +100 XP")
- Separator line between entries

JournalScreen.tsx:
Header: "Quest Journal" (Orbitron, text-2xl) + "[N] check-ins" counter (JetBrains Mono, --text-secondary)

Filter bar (horizontal tabs):
- All | With Notes | Milestones | Achievements
- Active tab: underline in --accent-primary

Filter logic:
- All: show all checkIns
- With Notes: checkIns where note !== null
- Milestones: checkIns where bonusEvents has a 'streak_milestone' type
- Achievements: checkIns where bonusEvents has an 'achievement' type

Display: sorted reverse-chronological (newest first). Map filtered checkIns to JournalEntry components.

Empty state: 
- If no check-ins at all: large text "Your journey starts with the first entry." + illustration (a simple SVG or emoji)
- If filter returns empty: "No entries match this filter."

Back navigation to Dashboard.

Show both component files.
```

---

### Phase 8 Checklist

- [ ] Journal screen is accessible from Dashboard "View All" link
- [ ] All past check-ins appear in reverse-chronological order
- [ ] Filter tabs change which entries display
- [ ] "With Notes" filter correctly shows only entries with notes
- [ ] Stat tags display using correct stat symbols from STAT_DEFINITIONS
- [ ] XP earned shows correct value per entry
- [ ] Bonus events (achievements, milestones) show in the entry
- [ ] Empty state renders when no check-ins exist
- [ ] Back navigation returns to Dashboard
- [ ] Journal screen renders correctly with 0, 1, and 10+ entries
- [ ] No console errors

---

## PHASE 9 — Stats & Profile Screen

### Context

The radar chart and lifetime statistics. Shows the user's full "build" as a character.

---

### Prompt 9.1 — Stats Screen & Radar Chart

```
Build src/components/stats/StatsScreen.tsx and src/components/stats/RadarChart.tsx.

RadarChart.tsx:
Use Recharts RadarChart component. 
Props: statPoints: Record<StatKey, number>
- 5 axes: FOCUS, DISCIPLINE, ENDURANCE, WISDOM, VITALITY
- Show the stat symbol (emoji) next to each axis label
- Fill: semi-transparent --accent-primary (rgba(245,158,11,0.2))
- Stroke: --accent-primary, strokeWidth 2
- Dot at each vertex: filled --accent-primary
- Custom tooltip showing the exact value
- Scale: domain [0, max(statPoints values) * 1.2] (scales to highest stat per PRD)
- Responsive: use ResponsiveContainer with 100% width, 300px height

StatsScreen.tsx sections:

1. Hunter Card (reuse HunterCard.tsx from dashboard)

2. Stats Radar section
   - "YOUR BUILD" heading (Orbitron, text-sm, --text-secondary, letter-spacing widest)
   - RadarChart component
   - Below chart: 5 stat rows showing symbol + key + current point value
     e.g., "🧠 FOCUS ──── 23"

3. Lifetime Stats section
   - Grid of stat tiles (2-column on mobile, 3-column on desktop):
     - Total XP (accent color)
     - Total Check-ins
     - Total Days Since Start
     - Longest Streak
     - Current Streak
     - Avg XP/Day (totalXP / totalDaysSinceStart, 1 decimal)
     - Consistency Score (X%)
     - Days to Level [N+1] (from estimateDaysToNextLevel)
   - Each tile: Card.tsx, JetBrains Mono value (large), Sora label (small, --text-secondary)

4. Achievements section
   - 5x5 grid (or flex-wrap) of badge circles
   - Unlocked: full color, show achievement emoji or first letter, glow
   - Locked: --text-muted, show "???" if not hidden, blank if hidden
   - Tap unlocked badge: show a tooltip/mini-modal with name, description, date earned, XP reward

5. Quest Details section
   - Quest name | Category | Started On | "Your Why" (if set, quoted)
   - Edit quest name: pencil icon → inline editable text input → save (updates store.quest.name)

Show StatsScreen.tsx and RadarChart.tsx.
```

---

### Phase 9 Checklist

- [ ] Stats screen is accessible from Dashboard navigation
- [ ] Radar chart renders with 5 axes
- [ ] Radar chart scales correctly — highest stat fills most of the area
- [ ] Stat point values match the sum of statsTagged across all check-ins (verify manually)
- [ ] All 8 lifetime stat tiles display correct values
- [ ] Avg XP/Day calculates correctly
- [ ] Achievements grid shows correct unlock state
- [ ] Locked hidden achievements show blank (not "???")
- [ ] Tapping unlocked achievement shows name + description + date earned
- [ ] Quest name is editable inline
- [ ] Editing quest name updates store and persists on refresh
- [ ] Recharts ResponsiveContainer resizes correctly on window resize

---

## PHASE 10 — Settings Screen

### Context

User preferences, reset options, and export functionality. Must be destructive-action-safe with double-confirmation.

---

### Prompt 10.1 — Settings Screen

```
Build src/components/settings/SettingsScreen.tsx.

Sections as specified in PRD Section 5.8:

1. Appearance
   - Three-option toggle: Dark / Light / System
   - Selecting Dark: sets --bg-primary to #0A0A0F (PRD dark palette)
   - Selecting Light: define a simple light palette override (all --bg-* become light grays/whites, --text-primary becomes dark)
   - System: uses prefers-color-scheme media query
   - Persist in store.settings.theme
   - Apply theme by setting a data-theme attribute on <html> and using CSS variable overrides

2. Notifications
   - Toggle switch: "Daily Reminder" on/off
   - When enabled: show a time picker (HTML input type="time")
   - On enable: request Notification API permission. If denied, show a message explaining browser settings.
   - Store time in store.settings.reminderTime and store.settings.reminderEnabled
   - Implement reminder scheduling: on app focus/load, if reminderEnabled and reminderTime is set, calculate if a notification should fire today and schedule it using setTimeout

3. Reset Options
   - "Reset Streak Only" button (secondary variant):
     - Confirmation modal: "This will reset your current streak to 0. Your XP and rank are kept."
     - On confirm: call resetStreak() from store
   - "Full Reset" button (danger variant):
     - First confirm modal: "Are you sure? This deletes all your progress permanently."
     - Second confirm modal: "Type 'RESET' to confirm." — text input must match exactly
     - On double-confirm: call fullReset() from store, navigate to Onboarding

4. Export
   - "Download Journal as Markdown" button
   - Generate a Markdown string from all checkIns:
     ```
     # Solo Quest Journal
     ## Quest: [name] | Started: [date]
     ---
     ### [Date] — Day [streakDay] — [XP] XP
     Stats: [statkeys]
     Note: [note or (no note)]
     ---
     ```
   - Use URL.createObjectURL(new Blob([markdown])) with download link click trick

5. Data Privacy Notice
   - "Your data is stored locally on this device. Nothing is sent to any server." (Sora, --text-secondary, small)

6. About
   - Version: "Solo Quest v1.0.0"
   - "View on GitHub" link (placeholder URL)

Show SettingsScreen.tsx.
```

---

### Phase 10 Checklist

- [ ] Theme toggle switches between dark and light correctly
- [ ] Theme persists on page refresh
- [ ] Light theme is readable (not just a broken dark theme)
- [ ] Notification toggle requests browser permission when enabled
- [ ] If notification permission denied: informative message shown (no crash)
- [ ] Reminder time input only appears when notifications are enabled
- [ ] "Reset Streak Only" shows confirmation modal before acting
- [ ] "Full Reset" requires TWO confirmations including typing "RESET"
- [ ] After Full Reset: app navigates to Onboarding, localStorage is cleared
- [ ] Export generates a valid Markdown file that downloads correctly
- [ ] Markdown export includes all check-in entries
- [ ] Version string shows "v1.0.0"
- [ ] No destructive action happens without explicit confirmation

---

## PHASE 11 — Navigation & App Shell

### Context

Wire all screens into a coherent navigation structure with bottom nav.

---

### Prompt 11.1 — App Shell & Navigation

```
Build the main App.tsx and navigation system.

Navigation structure:
- App has 4 main views: dashboard | journal | stats | settings
- Bottom navigation bar: 4 icons (Home, BookOpen, BarChart2, Settings from lucide-react)
- Active tab: icon and label highlighted in --accent-primary
- Inactive: --text-muted
- Bottom nav is fixed at the bottom, height 64px
- Content area: full height minus 64px, scrollable

App.tsx routing logic:
1. Read hasCompletedOnboarding from store
2. If false: render <OnboardingFlow /> full screen (no nav bar)
3. If true: render the shell with bottom nav
4. Within the shell, render the active view based on currentView state
5. Render <CeremonyGate /> as a global overlay (position fixed, z-index highest)

Add a top header bar:
- Left: "SOLO QUEST" in Orbitron, small, --text-primary
- Right: settings icon (navigates to settings view)
- Background: --bg-primary, border-bottom: 1px solid rgba(255,255,255,0.05)

Page transitions: Framer Motion AnimatePresence on the view container. Use a simple fade (opacity 0 → 1, 200ms) for view changes.

Update DashboardScreen to accept a navigation callback for "View All" (Journal) link.

Show complete App.tsx.
```

---

### Phase 11 Checklist

- [ ] All 4 navigation tabs work correctly
- [ ] Active tab is visually distinct (accent color)
- [ ] Onboarding shows full screen without bottom nav
- [ ] After completing onboarding, bottom nav appears
- [ ] View transitions fade correctly
- [ ] CeremonyGate is above the nav bar (z-index)
- [ ] "View All" in Dashboard navigates to Journal
- [ ] Settings gear icon in header navigates to settings
- [ ] Back from Journal/Stats/Settings returns to Dashboard
- [ ] App shell does not re-mount on tab change (state preserved)

---

## PHASE 12 — Polish, Animations & Edge Cases

### Context

All animations specified in PRD Section 10 must be implemented. All edge cases from PRD Section 11 must be handled. This phase turns a working app into a great app.

---

### Prompt 12.1 — Animation Audit

```
Audit every animation in the app against PRD Section 10 Animation Principles. Implement any that are missing:

1. Check-in XP burst: scale 0.8 → 1.3 → 1.0 with opacity fade, 400ms ease-out — in RewardScreen.tsx
2. Level-up number: scale 2.0 → 1.0 with blur-to-sharp, 600ms spring — in LevelUpCeremony.tsx
3. Rank-up glyph: particle explosion (CSS keyframes), 1200ms — in RankUpCeremony.tsx
4. XP bar fill: spring easing on width, 800ms, with glow pulse at 100% — in ProgressBar.tsx (Framer Motion layout animation)
5. Check-in button: gentle pulsing glow 3s loop when action pending — in CheckInButton.tsx
6. Streak increment: counter rolls up with slot-machine effect, 300ms — in StreakSection.tsx and RewardScreen.tsx

For each: show the exact Framer Motion code implementing the spec. Fix any that are missing or incorrect.

Additionally, add these micro-interactions:
- Stat pill tap in check-in: scale 0.95 → 1.0 spring on tap
- Achievement badge unlock: slide-in from right with spring, glow flash
- Category pill selection in onboarding: color fill animation on select

Run the app and verify each animation plays correctly.
```

---

### Prompt 12.2 — Edge Cases & Error Handling

```
Implement all edge cases from PRD Section 11:

1. Date/Timezone Safety
   - Audit every date operation in the codebase. Replace any Date.now() or new Date().toISOString().substring(0,10) with getTodayDateString() from dates.ts.
   - Add a comment on every date usage confirming it uses local time.

2. Check-In Idempotency
   - In performCheckIn(), add a guard at the very top:
     if (checkIns.length > 0 && checkIns[checkIns.length - 1].date === getTodayDateString()) return;
   - Write a test confirming this guard works.

3. Freeze Grace Period
   - The 48-hour window: implement and test that a freeze CAN be activated on the day after a missed day, but CANNOT be activated 2+ days later.
   - Add UI in StreakSection.tsx: if freeze is eligible (grace period active), show a pulsing "Activate Freeze?" prompt.

4. localStorage Quota
   - Add a try/catch around localStorage operations in the Zustand persist configuration.
   - If write fails, show a non-blocking toast notification: "Storage full. Consider exporting your journal."

5. Schema Migration
   - In useGameStore.ts, implement the migration chain:
     ```typescript
     function migrate(state: any, version: number): GameState {
       if (version < 1) {
         // Shouldn't happen, but handle gracefully
         return { ...INITIAL_STATE, ...state };
       }
       // Future: if (version < 2) { ... }
       return state as GameState;
     }
     ```
   - Pass this to the Zustand persist `migrate` option.

6. First Launch / Empty State
   - If hasCompletedOnboarding === false, ALWAYS show onboarding regardless of any URL state.
   - If quest === null but hasCompletedOnboarding === true (orphaned state): reset to fresh onboarding.

7. Inactivity State (30+ days)
   - On app open, check if lastCheckInDate exists and is 30+ days ago.
   - If so, show a "Dormant Hunter" full-screen modal before the Dashboard:
     - Shows totalXP, rank, longest streak prominently
     - Single CTA: "Resume Quest"
     - No guilt mechanics, pure re-engagement tone

8. Return of the Hunter (7+ days absent, < 30 days)
   - On app open, check if lastCheckInDate is 7–29 days ago.
   - Show a "Return of the Hunter" card (not full-screen, a banner/card) on the Dashboard:
     - Shows XP progress prominently
     - "Welcome back, Hunter." text
     - Dismissible

Show all updated files with the edge case implementations.
```

---

### Phase 12 Checklist

- [ ] All 6 animations from PRD Section 10 are implemented and playing correctly
- [ ] XP burst: scale goes 0.8 → 1.3 → 1.0 (not just 0 → 1)
- [ ] Level-up number has blur-to-sharp effect
- [ ] Check-in button pulses every 3 seconds when check-in is pending
- [ ] Streak counter has slot-machine roll effect
- [ ] Idempotency guard is in `performCheckIn()` — double-tap check-in is impossible
- [ ] Freeze grace period: day-after-miss = eligible, day-2-after-miss = not eligible (test manually)
- [ ] Dormant Hunter modal fires when lastCheckInDate is 31+ days ago (test by overriding date in store)
- [ ] Return of the Hunter banner fires when 7–29 days absent
- [ ] Schema migration function is present and wired to Zustand persist
- [ ] Orphaned state (quest null + onboarding true) redirects to fresh onboarding
- [ ] Date/timezone: grep for `new Date().toISOString().substring` — zero results
- [ ] All edge case tests added to test suite pass

---

## PHASE 13 — Testing & TypeScript Hardening

### Context

Zero-tolerance for runtime errors. Full TypeScript strict mode. Comprehensive unit tests for all game logic. This phase is the quality gate before deployment.

---

### Prompt 13.1 — Test Coverage

```
Run the full test suite and achieve the following coverage targets:

Required coverage:
- src/lib/xp.ts: 100% line coverage
- src/lib/levels.ts: 100% line coverage
- src/lib/ranks.ts: 100% line coverage
- src/lib/streaks.ts: 100% line coverage
- src/lib/achievements.ts: 100% line coverage
- src/lib/dates.ts: 90%+ line coverage
- src/store/useGameStore.ts: 80%+ line coverage

Run: npm run test -- --coverage

For any uncovered lines, add tests. Pay special attention to:
- Edge case: levelFromXP at exactly the XP threshold for a level (boundary cases)
- Edge case: rank evaluation when BOTH minLevel and minConsistency are at their minimum
- Edge case: calculateStreakMilestoneBonus for every milestone value
- Edge case: performCheckIn when called with 0 stats, no note (minimum XP case)
- Edge case: performCheckIn when called with 5 stats and a note (maximum XP case)
- Edge case: freeze activation when freezesAvailable === 0
- Edge case: fullReset followed by a new check-in (no leftover state from previous session)
- Edge case: levelFromXP(398107) === 100 (max level exactly)
- Edge case: comebackDaysRemaining correctly decrements over 3 consecutive check-ins

After achieving target coverage, run: npx tsc --noEmit
Fix every TypeScript error until output is clean.

Show the coverage report output.
```

---

### Prompt 13.2 — TypeScript Strict Mode Audit

```
Run a strict TypeScript audit on the entire codebase. Ensure:

1. No `any` types anywhere (use grep: grep -r ": any" src/ -- should return 0 results for non-comment lines)
2. All function parameters and return types are explicitly typed
3. All optional properties are handled with null checks before use
4. No non-null assertions (!.) except where genuinely impossible to be null (document with a comment explaining why)
5. No implicit `undefined` array access — check tsconfig has "noUncheckedIndexedAccess": true
6. No unused variables or imports (tsconfig "noUnusedLocals": true, "noUnusedParameters": true)
7. All event handlers have typed event parameters (React.MouseEvent, React.ChangeEvent<HTMLInputElement>, etc.)

Fix all issues found. Show the final `npx tsc --noEmit` output — it must be empty.
```

---

### Phase 13 Checklist

- [ ] `npm run test -- --coverage` shows: xp.ts 100%, levels.ts 100%, ranks.ts 100%, streaks.ts 100%
- [ ] All boundary cases are tested (exact threshold XP for level, exact consistency % for rank)
- [ ] `npx tsc --noEmit` produces zero output (zero errors, zero warnings)
- [ ] `grep -r ": any" src/` returns no matches (excluding comments)
- [ ] No non-null assertions (`!.`) without explanatory comments
- [ ] `npm run build` completes with no TypeScript errors and no Rollup warnings about large chunks
- [ ] Test suite runs in < 30 seconds total
- [ ] All 25 achievements have tested `checkCondition` functions

---

## PHASE 14 — PWA, Performance & Pre-Deployment

### Context

Make the app installable as a PWA, pass a Lighthouse audit, and prepare all assets for production deployment.

---

### Prompt 14.1 — PWA Setup

```
Configure Solo Quest as a Progressive Web App per PRD Section 12 Phase 4.

1. Create public/manifest.json:
```json
{
  "name": "Solo Quest",
  "short_name": "Solo Quest",
  "description": "One quest. One you. Every day.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0A0F",
  "theme_color": "#F59E0B",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

2. Create placeholder icons: for now, create simple SVG icons programmatically. In public/, create a Node script (or use sharp/canvas if available) to generate 192x192 and 512x512 PNG icons with the "SQ" initials in Orbitron style on --bg-primary background with --accent-primary text.

3. Create public/sw.js (Service Worker):
   - Cache strategy: Cache First for static assets (JS, CSS, fonts), Network First for the root HTML
   - Cache name: 'solo-quest-v1'
   - On install: cache all shell assets
   - On fetch: serve from cache with network fallback

4. Register the Service Worker in src/main.tsx:
```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

5. Add to index.html:
   - `<link rel="manifest" href="/manifest.json">`
   - `<meta name="theme-color" content="#F59E0B">`
   - `<meta name="apple-mobile-web-app-capable" content="yes">`
   - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
   - Apple touch icon link

Show all created/modified files.
```

---

### Prompt 14.2 — Performance Audit

```
Run a production build and perform a Lighthouse audit. Target: all scores >= 90.

Steps:
1. Run: npm run build
2. Run: npx serve dist (or use vite preview: npm run preview)
3. Open Chrome DevTools → Lighthouse → Run audit (Mobile preset)
4. For each failing category, apply fixes:

   Performance fixes:
   - Add font-display: swap to Google Fonts link
   - Lazy-load non-critical components: Journal, Stats, Settings (use React.lazy + Suspense)
   - Add loading="lazy" to any images
   - Ensure Framer Motion is tree-shaken (import from 'framer-motion' not 'framer-motion/dist/...')
   - If bundle > 500KB: analyze with npx vite-bundle-visualizer and split heavy dependencies
   
   Accessibility fixes:
   - All interactive elements must have accessible names (aria-label on icon-only buttons)
   - Color contrast: ensure text meets WCAG AA (4.5:1 ratio)
   - Focus indicators: add visible focus rings to all interactive elements (outline: 2px solid var(--accent-primary))
   - All images must have alt text
   
   Best Practices:
   - Add CSP meta tag (basic)
   - Ensure HTTPS (Vercel handles this)
   
   SEO:
   - Add meta description: "Solo Quest — RPG habit tracker. One quest, one you, every day."
   - Add og:title, og:description, og:type meta tags

Show the Lighthouse report scores and all changes made.
```

---

### Phase 14 Checklist

- [ ] `manifest.json` is valid (validate at https://manifest-validator.appspot.com/)
- [ ] App installs as PWA on mobile Chrome (test: browser shows "Add to Home Screen" prompt)
- [ ] Service Worker registers without errors (check DevTools → Application → Service Workers)
- [ ] App works offline after first load (test: DevTools → Network → Offline)
- [ ] Lighthouse Performance score >= 90
- [ ] Lighthouse Accessibility score >= 90
- [ ] Lighthouse Best Practices score >= 90
- [ ] Lighthouse SEO score >= 90
- [ ] All icon-only buttons have `aria-label`
- [ ] Focus rings are visible on keyboard navigation
- [ ] `npm run build` produces no warnings about bundle size exceeding 500KB (if it does, code-split)
- [ ] Google Fonts load with `font-display: swap` (no FOUT blocking paint)

---

## PHASE 15 — Deployment & Post-Deployment

### Context

Deploy to Vercel, confirm production behavior, write the README, and do a final regression test.

---

### Prompt 15.1 — GitHub Repository Setup

```
Prepare the GitHub repository for public deployment.

1. Create a comprehensive .gitignore:
   - node_modules/, dist/, .env, .env.local, *.local, .DS_Store, coverage/

2. Create README.md at the project root with:
   - App name + tagline: "Solo Quest — Make showing up feel like leveling up."
   - Live demo link (placeholder for Vercel URL)
   - 3-line description of what the app is
   - Feature list (reference PRD MVP features F-01 through F-16)
   - Screenshots section (add placeholder — actual screenshots added after deployment)
   - Mechanics explanation:
     - XP formula: Daily XP = round(100 × (1 + min(streak/100, 1))) + optional bonuses
     - Level curve: XP(L) = 100 × L^1.8 (Level 100 requires ~398K total XP)
     - Rank system: 8 tiers (E → SSS) based on consistency score × level gates
   - Tech stack section (from PRD Section 6)
   - Local development: npm install + npm run dev
   - Run tests: npm test
   - License: MIT

3. Commit all files with message: "feat: initial Solo Quest MVP — complete core loop"

Show README.md content.
```

---

### Prompt 15.2 — Vercel Deployment

```
Deploy Solo Quest to Vercel.

If Vercel CLI is available:
1. Run: npx vercel login
2. Run: npx vercel --prod
3. Confirm deployment URL

If using Vercel dashboard:
1. Import the GitHub repository
2. Framework preset: Vite
3. Build command: npm run build
4. Output directory: dist
5. No environment variables required (MVP uses localStorage only)

After deployment:
1. Open the production URL and run through the complete user journey:
   - Fresh load → Onboarding completes → Dashboard renders
   - Perform a check-in → Reward screen fires
   - XP bar updates correctly
   - Streak increments
   - Navigate to Journal → check-in appears
   - Navigate to Stats → radar chart renders
   - Navigate to Settings → theme toggle works
   - Hard refresh → all state persists (localStorage)

2. Test on mobile browser (Chrome on Android or Safari on iOS):
   - Touch interactions work
   - Bottom nav is reachable with thumb
   - Check-in modal opens and submits
   - PWA install prompt appears

3. Add the production Vercel URL to README.md live demo link.

List any issues found and how they were resolved.
```

---

### Prompt 15.3 — Final Regression Test

```
Perform a complete regression test of the deployed production app. Test every user-facing feature from the PRD:

F-01: Onboarding completes and sets quest name + category + why
F-02: Daily check-in works (one-tap + optional note)
F-03: XP system: perform check-in, verify XP matches formula: round(100 × multiplier) + bonuses
F-04: Level progression: verify XP bar shows correct progress toward next level
F-05: Streak tracking: verify current and longest streaks display and update
F-06: Streak freeze: verify freeze icons appear, long-press activates, count decrements
F-07: Rank system: verify rank letter, title, and aura display correctly for current rank
F-08: Dashboard: all key stats visible at a glance
F-09: Level-up animation fires when level threshold crossed (test by calculating required XP and doing multiple check-ins or manipulating store)
F-10: Failure/comeback: no XP lost after streak break; comeback banner shows
F-11: LocalStorage: all state persists on hard refresh (verify in DevTools → Application → Storage)
F-12: Dark mode: default theme is dark
F-13: Stat system: tag stats in check-in, verify radar chart updates
F-14: Achievements: A-01 (First Blood) fires on first check-in; verify +200 XP awarded
F-15: Quest journal: all entries appear in Journal screen with correct data
F-16: Weekly summary: (if implemented) fires on Sunday

Document any bugs found. Fix each one. Re-test after fix.
```

---

### Phase 15 Checklist

- [ ] GitHub repository is public (or private, per preference) and README is present
- [ ] README includes live demo link, feature list, mechanics explanation, and tech stack
- [ ] Vercel deployment succeeds on first push (no build errors in Vercel logs)
- [ ] Production URL loads in < 2 seconds on a fast connection
- [ ] Full onboarding → dashboard → check-in journey works on production
- [ ] State persists on hard refresh in production (localStorage is working)
- [ ] All navigation tabs work in production
- [ ] Ceremonies (level-up, rank-up) fire correctly in production
- [ ] App installs as PWA on Android Chrome and iOS Safari (check for install prompt)
- [ ] All 16 MVP features (F-01 through F-16) tested and confirmed working
- [ ] No JavaScript console errors in production (check DevTools on the live URL)
- [ ] No 404 errors for any assets (check DevTools Network tab on production)
- [ ] Mobile layout is usable — no horizontal scroll, no overlapping elements
- [ ] Lighthouse score on production URL: all categories >= 90

---

## APPENDIX A — Known Gotchas & AI Prompting Tips

### Common Pitfalls to Watch For

**Pitfall 1: XP formula approximation**
AI models sometimes approximate the level curve. Force exact verification:
> "Confirm xpForLevel(10) returns exactly 6310 and xpForLevel(50) returns exactly 109657 by running the calculation in-line."

**Pitfall 2: UTC vs local time**
AI models default to UTC. Enforce every time:
> "All date operations must use local time via date-fns format(new Date(), 'yyyy-MM-dd'). Never use toISOString().substring(0,10) or UTC-based methods."

**Pitfall 3: XP deduction**
Some AI implementations add "penalty" logic. Check every state mutation:
> "Search the entire codebase for any line that subtracts from totalXP or reduces any XP-related value. There must be zero such lines."

**Pitfall 4: Zustand store mutation**
Zustand requires returning new state objects in non-immer setups. Verify:
> "All store actions must use set((state) => ({ ...state, ... })) pattern. No direct mutation of state properties."

**Pitfall 5: Double ceremony trigger**
If pendingCeremony is not cleared before the next check-in, ceremonies can stack incorrectly. Ensure:
> "performCheckIn() must check if pendingCeremony is already set and handle gracefully — either queue or skip based on design intent."

**Pitfall 6: Recharts RadarChart domain**
Recharts RadarChart domain must be [0, maxValue] not [0, 'auto'] for correct scaling. Verify.

**Pitfall 7: Framer Motion AnimatePresence key**
Without unique keys, AnimatePresence won't trigger exit animations. Every animated child needs a unique `key` prop.

---

## APPENDIX B — Debug Commands

```bash
# Run all tests with coverage
npm run test -- --coverage

# TypeScript strict check (zero output = clean)
npx tsc --noEmit

# Find any `any` type usage (should return 0 non-comment results)
grep -rn ": any" src/ --include="*.ts" --include="*.tsx"

# Find any UTC date usage (should return 0)
grep -rn "toISOString().substring\|getUTCDate\|getUTCMonth" src/

# Find any XP subtraction (should return 0)
grep -rn "totalXP -\|xpEarned -\|- xp\|- XP" src/

# Bundle analysis
npx vite-bundle-visualizer

# Production build + local preview
npm run build && npm run preview

# Lighthouse CLI audit
npx lighthouse http://localhost:4173 --output=html --view
```

---

## APPENDIX C — Post-MVP Expansion Reference

When ready for v2.0 (PRD Section 3 Future features):
- F-17 (Supabase sync): Use PRD Section 7 Supabase schema. Add `supabase-js` package. Implement magic link auth first, then state sync on check-in.
- F-18 (Multiple quests): Gate behind S-rank check. Store array of Quests in GameState, add activeQuestId field.
- F-19 (Quest re-roll): Apply -15% XP penalty to totalXP as a `deductionEvents` array (NOT by removing check-ins — preserves history).
- F-22 (PWA): Already done in Phase 14. Service Worker is the foundation.
- F-26 (Boss Battles): Add weeklyChallenge field to GameState. Fire on Monday midnight. Award bonus XP on completion by Sunday.

---

*End of Solo Quest AI Development Workflow v1.0.0*  
*Total phases: 15 | Total prompts: ~30 | Estimated build time: 6–8 weeks*
