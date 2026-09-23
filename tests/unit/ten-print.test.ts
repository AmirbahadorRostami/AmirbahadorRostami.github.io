import { describe, expect, it } from 'vitest';
import { createTenPrintCells, mulberry32 } from '../../src/lib/ten-print';

describe('10 PRINT geometry', () => {
  it('creates deterministic cells that cover the viewport', () => {
    const options = { width: 320, height: 180, cellSize: 40, seed: 42, probability: 0.5 };
    const first = createTenPrintCells(options);
    expect(first).toEqual(createTenPrintCells(options));
    expect(first).toHaveLength(8 * 5);
    expect(first.at(-1)).toMatchObject({ x: 280, y: 160, size: 40 });
    expect(first.every(({ direction, alpha, tone }) =>
      (direction === 'forward' || direction === 'backward') &&
      alpha >= 0.24 && alpha <= 0.84 && tone >= 0 && tone <= 1,
    )).toBe(true);
    expect(new Set(first.map(({ direction }) => direction)).size).toBe(2);
  });

  it('caps invalid probabilities and rejects non-positive dimensions', () => {
    expect(() => createTenPrintCells({ width: 0, height: 20, cellSize: 10, seed: 1 })).toThrow();
    expect(() => createTenPrintCells({ width: 20, height: 20, cellSize: 0, seed: 1 })).toThrow();
    expect(createTenPrintCells({ width: 20, height: 20, cellSize: 10, seed: 1, probability: 9 }))
      .toHaveLength(4);
    expect(createTenPrintCells({ width: 20, height: 20, cellSize: 10, seed: 1, probability: -9 })
      .every(({ direction }) => direction === 'backward')).toBe(true);
  });

  it('returns a repeatable generator with values in [0, 1)', () => {
    const first = mulberry32(12);
    const second = mulberry32(12);
    const sequence = Array.from({ length: 8 }, () => first());
    expect(sequence).toEqual(Array.from({ length: 8 }, () => second()));
    expect(sequence.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});
