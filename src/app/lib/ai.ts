
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

function microStepsFor(taskName: string, energy: EnergyLevel): string[] {
  const lower = taskName.toLowerCase();
  const timer =
    energy === 'low' ? 'set a 5-minute timer' : energy === 'high' ? 'set a 20-minute timer' : 'set a 12-minute timer';

  // A few task-specific templates; otherwise default gentle steps.
  if (lower.includes('email') || lower.includes('reply') || lower.includes('text') || lower.includes('dm')) {
    return [
      'open the message thread',
      'write a 1-sentence reply (keep it simple)',
      'add any key detail or question',
      'read once for clarity',
      'hit send',
    ];
  }
  if (lower.includes('call') || lower.includes('phone')) {
    return [
      'open the contact and draft a short note of what you need',
      'pick a 10-minute window to call',
      'dial and say the first line',
      'ask the key question or make the request',
      'note next steps and end the call',
    ];
  }
  if (lower.includes('laundry')) {
    return ['gather clothes and supplies', 'start the wash', timer, 'move to dryer or hang', 'fold just one small pile'];
  }
  if (lower.includes('clean') || lower.includes('tidy')) {
    return ['pick one small zone (desk/counter)', 'remove trash', 'wipe surfaces', timer, 'reset the zone and stop'];
  }
  if (lower.includes('grocery') || lower.includes('errand') || lower.includes('shopping')) {
    return [
      'write a 5-item list',
      'group by aisle or store section',
      'grab essentials first',
      'check out',
      'unpack and put away one category',
    ];
  }
  if (lower.includes('study') || lower.includes('read') || lower.includes('research')) {
    return ['open the doc or chapter', 'write 3 focus questions', timer, 'capture 3 key points', 'stop and summarize'];
  }
  if (lower.includes('write') || lower.includes('draft') || lower.includes('outline')) {
    return ['open a blank doc', 'write a messy 3-bullet outline', timer, 'turn one bullet into 3 sentences', 'save'];
  }
  if (lower.includes('plan') || lower.includes('organize') || lower.includes('schedule')) {
    return ['brain-dump 5 bullets', 'circle the top 1', 'define the next physical action', timer, 'pick a time to do it'];
  }
  if (lower.includes('vscode') || lower.includes('code') || lower.includes('npm') || lower.includes('bug')) {
    return [
      'open the project',
      'run the dev server',
      'find the exact file or component',
      timer,
      'make the smallest change and refresh',
      'note what changed',
    ];
  }

  return [
    'take one deep breath',
    'define what "done enough" looks like',
    'start the first tiny action',
    timer,
    'wrap up and mark it done',
  ];
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
      ? "your system feels a bit low on fuel. we’ll keep it gentle and clear."
      : energy_level === 'high'
        ? "you’ve got momentum—let’s channel it into a meaningful win."
        : "you’ve got enough capacity for a solid, steady step forward.";

  const starters = tasks.slice(0, Math.max(1, Math.ceil(tasks.length * 0.6))).map((t) => ({
    name: t,
    minutes: 5,
    difficulty: 'easy' as const,
    steps: microStepsFor(t, energy_level),
    why_now: 'quick wins lower friction and build momentum.',
    brain_benefit: 'reduces decision load and makes progress feel safe.',
  }));

  const mains = energy_level === 'low'
    ? []
    : tasks.slice(starters.length).slice(0, 5).map((t) => ({
        name: t,
        minutes: energy_level === 'high' ? 20 : 15,
        difficulty: energy_level === 'high' ? ('challenging' as const) : ('moderate' as const),
        steps: [
          ...microStepsFor(t, energy_level),
          energy_level === 'high' ? 'do a focused 20-minute sprint' : 'do a focused 12-minute sprint',
          'stop, save your place, and celebrate',
        ],
        why_now: 'your energy can support a focused chunk of progress.',
        brain_benefit: 'channels focus and turns effort into visible results.',
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
      what_i_noticed: 'i’m using your words and tone to estimate your current capacity and nervous-system needs.',
      matching_strategy:
        'i start with low-friction wins to build safety, then offer deeper tasks only if your energy supports them.',
      encouragement: 'you don’t need perfect energy—consistent tiny steps are enough.',
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
