
export type EnergyLevel = 'low' | 'medium' | 'high';
export type Difficulty = 'minimal' | 'easy' | 'moderate' | 'challenging';

export interface BrainState {
  energy_level: EnergyLevel;
  emotional_tone: string;
  state_label: string;
  description: string;
  nervous_system_need: 'safety' | 'momentum' | 'grounding' | 'challenge' | 'rest' | 'connection' | string;
}

export interface MatchedTask {
  name: string;
  minutes: number;
  difficulty: Difficulty;
  steps: string[];
  why_now: string;
  brain_benefit?: string;
}

export interface AiReasoning {
  what_i_noticed: string;
  matching_strategy: string;
  encouragement: string;
}

export interface AiResponse {
  brain_state: BrainState;
  matched_tasks: {
    starters: MatchedTask[];
    mains: MatchedTask[];
  };
  ai_reasoning?: AiReasoning;
}

function parseTasks(brainDump: string): string[] {
  return brainDump
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .replace(/^[•\-*→►▸▹]\s*/u, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/^\[\s*\]\s*/, '')
        .replace(/^[x✓✔]\s*/u, '')
        .trim(),
    )
    .filter(Boolean);
}

function microStepsFor(taskName: string): string[] {
  const lower = taskName.toLowerCase();
  // A few task-specific templates; otherwise default gentle steps.
  if (lower.includes('email') || lower.includes('reply') || lower.includes('text')) {
    return ['open the message', 'write a 1-sentence reply', 'hit send (that’s it)'];
  }
  if (lower.includes('laundry')) {
    return ['grab clothes + detergent', 'start the wash', 'set a timer'];
  }
  if (lower.includes('vscode') || lower.includes('code') || lower.includes('npm')) {
    return ['open vscode', 'run the dev server', 'make one tiny change'];
  }
  return ['take one deep breath', `start the first tiny step of: ${taskName}`, 'stop when you reach “done enough”'];
}

function buildMockResponse(tasksText: string, vibeText: string): AiResponse {
  const tasks = parseTasks(tasksText);
  const vibe = vibeText.toLowerCase();

  const isFoggy = ['tired', 'foggy', 'overwhelmed', 'exhausted', 'sleepy', 'burnt'].some((w) => vibe.includes(w));
  const isEnergized = ['energized', 'ready', 'motivated', 'focused', 'excited', 'zoomies'].some((w) => vibe.includes(w));

  const energy_level: EnergyLevel = isFoggy ? 'low' : isEnergized ? 'high' : 'medium';

  const state_label =
    energy_level === 'low' ? 'foggy, but safe' : energy_level === 'high' ? 'energized and ready' : 'steady and capable';

  const description =
    energy_level === 'low'
      ? "your brain’s low on fuel. we’re going gentle today."
      : energy_level === 'high'
        ? "you’ve got momentum—let’s use it on something that matters."
        : "you’ve got enough capacity for a solid step forward.";

  const starters = tasks.slice(0, Math.max(1, Math.ceil(tasks.length * 0.6))).map((t) => ({
    name: t,
    minutes: 5,
    difficulty: 'easy' as const,
    steps: microStepsFor(t),
    why_now: 'low friction + clear finish = instant momentum.',
    brain_benefit: 'reduces decision load and builds safety through completion.',
  }));

  const mains = energy_level === 'low'
    ? []
    : tasks.slice(starters.length).slice(0, 5).map((t) => ({
        name: t,
        minutes: energy_level === 'high' ? 20 : 15,
        difficulty: energy_level === 'high' ? ('challenging' as const) : ('moderate' as const),
        steps: [...microStepsFor(t), 'do a 10-minute sprint', 'stop and celebrate'],
        why_now: 'you have enough bandwidth for a structured chunk of progress.',
        brain_benefit: 'channels focus and converts motivation into results.',
      }));

  return {
    brain_state: {
      energy_level,
      emotional_tone: isFoggy ? 'overwhelmed' : isEnergized ? 'excited' : 'present',
      state_label,
      description,
      nervous_system_need: energy_level === 'low' ? 'safety' : energy_level === 'high' ? 'challenge' : 'momentum',
    },
    matched_tasks: {
      starters,
      mains,
    },
    ai_reasoning: {
      what_i_noticed: 'i’m using your words + overall tone to estimate your current capacity.',
      matching_strategy: 'i prioritize low-friction wins first, then offer deeper tasks only if your energy supports it.',
      encouragement: 'you don’t need perfect energy—just one tiny step counts.',
    },
  };
}

/**
 * Analyze the user’s tasks + vibe and return a structured, privacy-first response.
 *
 * Default behavior:
 * - Calls a backend endpoint at POST /api/analyze (recommended so keys stay server-side).
 * - Falls back to a lightweight on-device mock if the endpoint isn’t available.
 */
export async function analyzeEverything(tasksText: string, vibeText: string): Promise<AiResponse> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: tasksText, vibe: vibeText }),
    });

    if (!res.ok) throw new Error(`api/analyze failed: ${res.status}`);

    const data = (await res.json()) as AiResponse;
    // minimal shape check
    if (!data?.brain_state || !data?.matched_tasks) throw new Error('invalid ai response shape');
    return data;
  } catch (err) {
    console.warn('[flux] using mock ai response:', err);
    return buildMockResponse(tasksText, vibeText);
  }
}
