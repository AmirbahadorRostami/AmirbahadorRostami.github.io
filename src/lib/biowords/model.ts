import { mulberry32 } from '../ten-print';
import { scoreSentiment } from './sentiment';

export interface BioWordCreature {
  id: string;
  word: string;
  genome: number[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  survivalMs: number;
  community: number;
  alive: boolean;
}

export interface SimulationState {
  seed: number;
  sentiment: number;
  elapsedMs: number;
  status: 'ready' | 'running' | 'paused' | 'complete';
  creatures: BioWordCreature[];
  /** Serializable timing data preserves determinism across animation-frame sizes. */
  remainderMs?: number;
  stableMs?: number;
  stableMembers?: string;
}

const STEP = 50;
const LIMIT = 30_000;
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const distance = (a: BioWordCreature, b: BioWordCreature) => Math.hypot(a.x - b.x, a.y - b.y);
const trait = (c: BioWordCreature) => c.genome.reduce((a, b) => a + b, 0) / c.genome.length;
const survivalOrder = (a: BioWordCreature, b: BioWordCreature) => b.survivalMs - a.survivalMs || b.energy - a.energy;

export function tokenizeOriginalWords(input: string): string[] {
  return input.match(/\p{L}[\p{L}\p{M}]*(?:['’][\p{L}\p{M}]+)*/gu) ?? [];
}

export function createSimulation(input: string, seed: number): SimulationState {
  if (input.length > 280) throw new Error('Keep the text to 280 characters.');
  const words = tokenizeOriginalWords(input);
  if (!words.length) throw new Error('Enter at least one word.');
  if (!Number.isFinite(seed)) throw new Error('Use a finite numeric seed.');
  const random = mulberry32(seed);
  const sentiment = scoreSentiment(words);
  return {
    seed, sentiment, elapsedMs: 0, status: 'ready', remainderMs: 0, stableMs: 0, stableMembers: '',
    creatures: words.map((word, index) => ({
      id: `word-${index}`, word,
      genome: Array.from(word, letter => letter.codePointAt(0)! / 0x10ffff),
      x: 0.1 + random() * 0.8, y: 0.1 + random() * 0.8,
      vx: (random() - 0.5) * 0.12, vy: (random() - 0.5) * 0.12,
      energy: 35 + random() * 25 + sentiment * 10,
      survivalMs: 0, community: index, alive: true,
    })),
  };
}

function tick(state: SimulationState): SimulationState {
  const living = state.creatures.filter(c => c.alive);
  const creatures = state.creatures.map(c => {
    if (!c.alive) return { ...c };
    const neighbours = living.filter(other => other.id !== c.id && distance(c, other) < 0.24);
    let ax = (0.5 - c.x) * 0.035;
    let ay = (0.5 - c.y) * 0.035;
    let support = 0;
    for (const other of neighbours) {
      const d = Math.max(distance(c, other), 0.001);
      // Alignment and cohesion, with short-range separation.
      ax += ((other.vx - c.vx) * 0.7 + (other.x - c.x) * 0.5) / neighbours.length;
      ay += ((other.vy - c.vy) * 0.7 + (other.y - c.y) * 0.5) / neighbours.length;
      if (d < 0.055) {
        ax += (c.x - other.x) / d * 0.18;
        ay += (c.y - other.y) / d * 0.18;
      }
      support += 1 - clamp(Math.abs(trait(c) - trait(other)) * 10);
    }
    ax += c.x < 0.1 ? 0.3 : c.x > 0.9 ? -0.3 : 0;
    ay += c.y < 0.1 ? 0.3 : c.y > 0.9 ? -0.3 : 0;
    // Sentiment affects both motion and environmental pressure.
    const pace = 1 - state.sentiment * 0.2;
    let vx = c.vx + ax * 0.05 * pace;
    let vy = c.vy + ay * 0.05 * pace;
    const speed = Math.hypot(vx, vy);
    if (speed > 0.2) { vx *= 0.2 / speed; vy *= 0.2 / speed; }
    const energy = clamp(c.energy + (Math.min(support, 3) * 1.8 - 3 + state.sentiment - (neighbours.length ? 0 : 2)) * 0.05, 0, 100);
    return { ...c, x: clamp(c.x + vx * 0.05), y: clamp(c.y + vy * 0.05), vx, vy,
      energy, survivalMs: c.survivalMs + STEP, alive: energy > 0 };
  });
  // Prevent simultaneous extinction without adding or resurrecting any word.
  if (!creatures.some(c => c.alive) && living.length) {
    const retained = [...living].sort(survivalOrder)[0];
    Object.assign(creatures.find(c => c.id === retained.id)!, { alive: true, energy: 0.01 });
  }
  const survivors = creatures.filter(c => c.alive);
  const visited = new Set<string>();
  let communities = 0;
  for (const root of survivors) {
    if (visited.has(root.id)) continue;
    const pending = [root];
    visited.add(root.id);
    while (pending.length) {
      const current = pending.pop()!;
      current.community = communities;
      for (const other of survivors) {
        if (!visited.has(other.id) && distance(current, other) < 0.24) {
          visited.add(other.id); pending.push(other);
        }
      }
    }
    communities += 1;
  }
  const members = communities === 1 ? survivors.map(c => c.id).join(',') : '';
  const stableMs = members ? (members === state.stableMembers ? state.stableMs ?? 0 : 0) + STEP : 0;
  const elapsedMs = state.elapsedMs + STEP;
  return { ...state, creatures, elapsedMs, stableMembers: members, stableMs,
    status: stableMs >= 2000 || elapsedMs >= LIMIT ? 'complete' : 'running' };
}

export function stepSimulation(state: SimulationState, deltaMs: number): SimulationState {
  if (state.status === 'paused' || state.status === 'complete') return state;
  if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new Error('Use a finite, non-negative time step.');
  let remaining = (state.remainderMs ?? 0) + Math.min(deltaMs, LIMIT);
  let next = state;
  while (remaining >= STEP && next.status !== 'complete') {
    next = tick(next);
    remaining -= STEP;
  }
  return { ...next, remainderMs: next.status === 'complete' ? 0 : remaining };
}

export function runToCompletion(state: SimulationState): SimulationState {
  return state.status === 'complete' ? state : stepSimulation({ ...state, status: 'running' }, LIMIT);
}

export function survivorSentence(state: SimulationState): string {
  return state.creatures.filter(c => c.alive).sort(survivalOrder).map(c => c.word).join(' ');
}
