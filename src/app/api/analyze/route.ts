import Anthropic from '@anthropic-ai/sdk'
import type { BrainStateKey, BrainModeResponse, RankedTask, ThemeConfig } from '@/app/lib/types'

// ─── Theme map (server-injected so Claude never hallucinates color values) ────

const THEMES: Record<BrainStateKey, ThemeConfig> = {
  flow: {
    stateKey:      'flow',
    displayName:   'Flow State',
    colorTokens:   { base: '#0a0a1a', accent: '#6366f1', surface: '#1e1b4b', text: '#e0e7ff' },
    motionProfile: 'snap',
    ambientVideoId: 'flow-deep-space-loop',
    taskCategories: ['deep focus', 'complex problem solving', 'creative systems', 'high-stakes writing'],
  },
  creative: {
    stateKey:      'creative',
    displayName:   'Creative Mode',
    colorTokens:   { base: '#1a0a2e', accent: '#c084fc', surface: '#2d1b69', text: '#f3e8ff' },
    motionProfile: 'bounce',
    ambientVideoId: 'creative-aurora-loop',
    taskCategories: ['brainstorming', 'design', 'writing', 'ideation', 'exploration'],
  },
  recovery: {
    stateKey:      'recovery',
    displayName:   'Recovery Mode',
    colorTokens:   { base: '#0d1a14', accent: '#34d399', surface: '#1a2e22', text: '#d1fae5' },
    motionProfile: 'breathe',
    ambientVideoId: 'recovery-forest-loop',
    taskCategories: ['light admin', 'reading', 'reviewing', 'organizing', 'low-stakes replies'],
  },
  admin: {
    stateKey:      'admin',
    displayName:   'Admin Mode',
    colorTokens:   { base: '#0a1628', accent: '#60a5fa', surface: '#1e3a5f', text: '#dbeafe' },
    motionProfile: 'rhythmic',
    ambientVideoId: 'admin-rain-loop',
    taskCategories: ['admin', 'scheduling', 'email', 'data entry', 'routine tasks'],
  },
  social: {
    stateKey:      'social',
    displayName:   'Social Mode',
    colorTokens:   { base: '#1a0f00', accent: '#fb923c', surface: '#2d1a00', text: '#ffedd5' },
    motionProfile: 'bounce',
    ambientVideoId: 'social-golden-loop',
    taskCategories: ['communication', 'collaboration', 'meetings', 'feedback', 'outreach'],
  },
  rest: {
    stateKey:      'rest',
    displayName:   'Rest Mode',
    colorTokens:   { base: '#0f0f1a', accent: '#a78bfa', surface: '#1a1a2e', text: '#ede9fe' },
    motionProfile: 'fade',
    ambientVideoId: 'rest-drift-loop',
    taskCategories: ['reflection', 'light reading', 'journaling', 'gentle planning'],
  },
}

// ─── Claude prompt ────────────────────────────────────────────────────────────

const systemPrompt = `You are a cognitive state classifier for BrainMode, a neuroscience-backed productivity app.

You will receive validated psychological check-in data:
- arousal (1-9): low = calm/sleepy, high = alert/excited (Russell's Affect Grid)
- valence (1-9): low = negative/stressed, high = positive/content
- cognitiveLoad (1-5): 1 = clear mind, 5 = mentally saturated
- energy (1-5): 1 = depleted, 5 = energized

Your job:
1. Classify the user into ONE of 6 brain states: flow, creative, recovery, admin, social, rest
2. Provide a 1-2 sentence description of their current cognitive reality (warm, specific, NOT clinical)
3. Explain the neuroscience rationale briefly (1 sentence — cite the mechanism, not a study)
4. Re-rank the provided tasks by how well they match this cognitive state
5. Assign each task a matchScore (0.0–1.0) and brief matchReason

Classification rules:
- flow: high arousal (6-9) + positive valence (6-9) + low cognitive load (1-2) + high energy (4-5)
- creative: moderate-high arousal (5-8) + positive valence (6-9) + moderate load (2-3)
- recovery: low arousal (1-4) + any valence + moderate-high load (3-5) OR low energy (1-2)
- admin: moderate arousal (4-6) + neutral valence (4-6) + moderate load (2-4)
- social: moderate-high arousal (5-8) + positive valence (6-9) + moderate load (2-3) [distinguish from creative by task context]
- rest: very low arousal (1-3) + low valence (1-4) OR energy=1

Respond ONLY in valid JSON with this exact shape (no markdown, no extra keys):
{
  "brainState": "<one of: flow | creative | recovery | admin | social | rest>",
  "confidence": <0.0–1.0>,
  "displayName": "<e.g. Flow State>",
  "description": "<1-2 warm sentences about the user's current cognitive reality>",
  "cognitiveRationale": "<1 sentence citing the neuroscience mechanism>",
  "rankedTasks": [
    {
      "text": "<original task text>",
      "matchScore": <0.0–1.0>,
      "matchReason": "<brief reason>",
      "category": "<deep focus | creative | admin | social | rest>"
    }
  ]
}`

// ─── Route handler ────────────────────────────────────────────────────────────

interface AnalyzeRequestBody {
  checkIn: { arousal: number; valence: number; cognitiveLoad: number; energy: number }
  tasks:   string[]
}

type ClaudePartialResponse = Omit<BrainModeResponse, 'theme'>

const client = new Anthropic()

export async function POST(request: Request): Promise<Response> {
  let body: AnalyzeRequestBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid request body' }, { status: 400 })
  }

  const { checkIn, tasks } = body
  if (
    typeof checkIn?.arousal !== 'number' ||
    typeof checkIn?.valence !== 'number' ||
    typeof checkIn?.cognitiveLoad !== 'number' ||
    typeof checkIn?.energy !== 'number' ||
    !Array.isArray(tasks)
  ) {
    return Response.json({ error: 'missing or invalid checkIn / tasks fields' }, { status: 400 })
  }

  const userMessage = JSON.stringify({ checkIn, tasks })

  const message = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userMessage }],
  })

  const raw = message.content[0]
  if (raw.type !== 'text') {
    return Response.json({ error: 'unexpected response type from Claude' }, { status: 502 })
  }

  let partial: ClaudePartialResponse
  try {
    partial = JSON.parse(raw.text)
  } catch {
    return Response.json({ error: 'Claude returned non-JSON response' }, { status: 502 })
  }

  const brainState = partial.brainState as BrainStateKey
  if (!THEMES[brainState]) {
    return Response.json({ error: `unknown brainState: ${brainState}` }, { status: 502 })
  }

  const response: BrainModeResponse = {
    ...partial,
    theme: THEMES[brainState],
  }

  return Response.json(response)
}
