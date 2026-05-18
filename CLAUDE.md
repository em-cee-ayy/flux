# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # Install dependencies
npm run dev    # Start dev server (auto-opens in browser)
npm run build  # Production build
```

No test or lint scripts are configured.

## Architecture

**Flux** is a mood-aware task management app generated from a Figma design. Users dump tasks, describe their vibe, and the app recommends what to work on now.

### Screen-Based State Machine

`App.tsx` is the single source of truth. There is no router — `currentScreen` state switches between screens, with `AnimatePresence` (from the `motion` library) handling transitions.

Screens in order: `brain-dump` → `vibe-check` → `brain-state-result` → `dopamine-menu` → `one-task-focus` → `journal-entry`

Key state in `App.tsx`:
- `tasksText` — raw task list from BrainDump
- `vibeText` — mood/energy description from VibeCheck
- `ai: AiResponse` — structured analysis result
- `selectedTask` — task chosen in DopamineMenu

### AI Integration (`src/app/lib/ai.ts`)

Calls `POST /api/analyze` with `{ tasks, vibe }`. Falls back to an on-device mock (`buildMockResponse`) if the endpoint is unavailable. The `AiResponse` shape:

```ts
{
  brain_state: { energy_level, emotion, description },
  matched_tasks: { starters: Task[], mains: Task[] },
  ai_reasoning?: string
}
```

The `/api/analyze` endpoint is **not implemented in this repo** — it must be provided externally or proxied.

### Styling

- **Tailwind CSS 4** for utilities
- **Custom design tokens** in `src/styles/theme.css` — use these CSS variables (`--flux-base`, `--flux-peach`, `--flux-purple`, `--flux-sage`, `--flux-navy`, etc.) for any color work
- **shadcn/ui** components live in `src/app/components/ui/` — prefer these over raw Radix or MUI

### Figma Origin

This project was exported from Figma Make (design file: `figma.com/design/QcMzmv337rphy0BANnjGCt`). Illustration assets are in `public/illustrations/` as static PNGs/SVGs. `ImageWithFallback.tsx` wraps `<img>` with a graceful SVG fallback.

### Persistence

Two `localStorage` keys are used:
- `flux:last_journal_entry` — task completion record
- `flux:last_share_intent` — share channel + task
