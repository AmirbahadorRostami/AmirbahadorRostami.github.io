import { expect, it } from 'vitest';
import { createSimulation, stepSimulation, runToCompletion, survivorSentence, tokenizeOriginalWords } from '../../src/lib/biowords/model';

it('preserves original Unicode words and duplicate spellings', () => {
  expect(tokenizeOriginalWords('Hello, strange world—hello!')).toEqual(['Hello', 'strange', 'world', 'hello']);
  expect(tokenizeOriginalWords("café cafe\u0301 don't 你好")).toEqual(['café', 'cafe\u0301', "don't", '你好']);
});

it('validates UTF-16 length and wordless input', () => {
  for (const input of [' ', '!?', '123']) expect(() => createSimulation(input, 1)).toThrow('Enter at least one word.');
  expect(() => createSimulation('x'.repeat(281), 1)).toThrow('Keep the text to 280 characters.');
  expect(createSimulation('x'.repeat(280), 1).creatures).toHaveLength(1);
});

it('derives genomes from letters and deterministic seeded movement', () => {
  const a = createSimulation('soft soft machines', 17);
  expect(a).toEqual(createSimulation('soft soft machines', 17));
  expect(a.creatures[0].genome).toEqual(a.creatures[1].genome);
  expect(a.creatures[0].id).not.toBe(a.creatures[1].id);
  expect(a.creatures[0].genome).not.toEqual(a.creatures[2].genome);
  expect(a.creatures.flatMap(c => c.genome).every(n => n >= 0 && n <= 1)).toBe(true);
  expect(a).not.toEqual(createSimulation('soft soft machines', 18));
  const snapshot = structuredClone(a);
  expect(stepSimulation(a, 500)).toEqual(stepSimulation(stepSimulation(a, 125), 375));
  expect(a).toEqual(snapshot);
});

it('orders only surviving originals by survival time, then energy', () => {
  const state = createSimulation('second first third gone', 1);
  Object.assign(state.creatures[0], { survivalMs: 900, energy: 80 });
  Object.assign(state.creatures[1], { survivalMs: 1200, energy: 10 });
  Object.assign(state.creatures[2], { survivalMs: 900, energy: 20 });
  Object.assign(state.creatures[3], { survivalMs: 1400, alive: false });
  expect(survivorSentence(state)).toBe('first second third');
});

it('keeps positions, speed, and energy bounded and completes within 30 seconds', () => {
  let state = createSimulation('we gather around a quiet signal', 9);
  while (state.status !== 'complete') {
    state = stepSimulation(state, 50);
    for (const c of state.creatures) {
      expect(c.x).toBeGreaterThanOrEqual(0); expect(c.x).toBeLessThanOrEqual(1);
      expect(c.y).toBeGreaterThanOrEqual(0); expect(c.y).toBeLessThanOrEqual(1);
      expect(Math.hypot(c.vx, c.vy)).toBeLessThanOrEqual(0.200001);
      expect(c.energy).toBeGreaterThanOrEqual(0); expect(c.energy).toBeLessThanOrEqual(100);
    }
  }
  expect(state.elapsedMs).toBeLessThanOrEqual(30_000);
  expect(state.creatures.some(c => c.alive)).toBe(true);
  expect(runToCompletion(createSimulation('we gather around a quiet signal', 9))).toEqual(state);
});

it('requires two seconds of a stable community and respects pause/completion', () => {
  const state = createSimulation('alone', 1);
  expect(stepSimulation(state, 1950).status).toBe('running');
  expect(stepSimulation(state, 2000).status).toBe('complete');
  expect(stepSimulation({ ...state, status: 'paused' }, 500).elapsedMs).toBe(0);
  expect(runToCompletion({ ...state, status: 'paused' }).status).toBe('complete');
  expect(stepSimulation(runToCompletion(state), 500)).toEqual(runToCompletion(state));
});

it('selects at zero energy but retains the strongest original if all would die', () => {
  const state = createSimulation('old young', 3);
  state.creatures.forEach((c, i) => Object.assign(c, { x: i, y: i, energy: 0.001, survivalMs: i ? 50 : 100 }));
  const result = stepSimulation(state, 50);
  expect(result.creatures.filter(c => c.alive).map(c => c.word)).toEqual(['old']);
  expect(result.creatures[1].energy).toBe(0);
  expect(survivorSentence(runToCompletion(result))).toBe('old');
});

it('supports compatible neighbors and makes negative environments harsher', () => {
  const state = createSimulation('same same', 1);
  state.creatures.forEach(c => Object.assign(c, { x: 0.5, y: 0.5, energy: 50 }));
  const together = stepSimulation(state, 50);
  const apart = structuredClone(state);
  apart.creatures[1].x = 1;
  expect(together.creatures[0].energy).toBeGreaterThan(stepSimulation(apart, 50).creatures[0].energy);
  expect(stepSimulation({ ...state, sentiment: 1 }, 50).creatures[0].energy)
    .toBeGreaterThan(stepSimulation({ ...state, sentiment: -1 }, 50).creatures[0].energy);
});
