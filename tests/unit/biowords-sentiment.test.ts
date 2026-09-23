import { expect, it } from 'vitest';
import { scoreSentiment } from '../../src/lib/biowords/sentiment';

it('scores positive, negative, mixed, unknown, empty, and case-insensitive words locally', () => {
  expect(scoreSentiment(['LOVE', 'hope'])).toBe(1);
  expect(scoreSentiment(['hate', 'fear'])).toBe(-1);
  expect(scoreSentiment(['love', 'fear'])).toBe(0);
  expect(scoreSentiment(['love', 'hope', 'fear', 'machine'])).toBeCloseTo(1 / 3);
  expect(scoreSentiment(['machine'])).toBe(0);
  expect(scoreSentiment([])).toBe(0);
});
