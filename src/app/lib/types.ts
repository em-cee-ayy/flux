export type BrainStateKey = 'flow' | 'creative' | 'recovery' | 'admin' | 'social' | 'rest'

export type MotionProfile = 'drift' | 'bounce' | 'breathe' | 'snap' | 'rhythmic' | 'fade'

export interface CheckInData {
  arousal:       number  // 1–9 (Affect Grid — x axis)
  valence:       number  // 1–9 (Affect Grid — y axis)
  cognitiveLoad: number  // 1–5 (CLQ — working memory pressure)
  energy:        number  // 1–5 (self-reported energy level)
}

export interface ThemeConfig {
  stateKey:       BrainStateKey
  displayName:    string           // "Flow State", "Recovery Mode", etc.
  colorTokens: {
    base:    string  // e.g. '#0a0a1a' (deep space for flow)
    accent:  string  // primary highlight color for this state
    surface: string  // card/container background
    text:    string  // primary text on this background
  }
  motionProfile:   MotionProfile   // drives Framer Motion easing presets
  ambientVideoId:  string          // pre-generated Higgsfield loop key
  taskCategories:  string[]        // task types to surface (e.g. ['deep focus', 'complex problem solving'])
}

export interface BrainModeResponse {
  brainState:         BrainStateKey
  confidence:         number           // 0–1
  displayName:        string
  description:        string           // 1-2 sentences explaining WHY this state
  cognitiveRationale: string           // the psych reasoning — shown in UI
  theme:              ThemeConfig
  rankedTasks:        RankedTask[]     // tasks re-sorted by cognitive mode match
  insight?:           string           // longitudinal pattern if Supabase has history
}

export interface RankedTask {
  text:        string
  matchScore:  number   // 0–1 — how well this task fits the current state
  matchReason: string   // e.g. "low cognitive load — ideal for recovery mode"
  category:    string   // 'deep focus' | 'creative' | 'admin' | 'social' | 'rest'
}
