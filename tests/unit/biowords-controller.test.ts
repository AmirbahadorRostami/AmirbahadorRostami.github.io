import { describe, expect, it } from 'vitest';
import { createBioWordsController } from '../../src/lib/biowords/controller';

describe('BioWords controller', () => {
  it('supports explicit lifecycle transitions and deterministic restart', () => {
    const c = createBioWordsController({ input: 'signals gather softly', seed: 4 });
    const initial = c.snapshot();
    c.begin(); c.advance(100); c.pause();
    expect(c.snapshot().status).toBe('paused');
    const paused = c.snapshot(); c.advance(500);
    expect(c.snapshot()).toEqual(paused);
    c.resume(); expect(c.snapshot().status).toBe('running');
    c.skip(); expect(c.snapshot().status).toBe('complete');
    expect(c.result().split(' ').every(w => ['signals', 'gather', 'softly'].includes(w))).toBe(true);
    const result = c.result(); c.begin(); expect(c.snapshot().status).toBe('complete');
    c.restart(); expect(c.snapshot()).toEqual(initial);
    c.skip(); expect(c.result()).toBe(result);
    c.destroy(); expect(() => c.begin()).toThrow('destroyed');
  });
  it('returns isolated snapshots and advances fixed model time', () => {
    const c = createBioWordsController({ input: 'one two three', seed: 8 });
    c.snapshot().creatures[0].word = 'changed';
    expect(c.snapshot().creatures[0].word).toBe('one');
    c.begin(); c.advance(25); expect(c.snapshot().elapsedMs).toBe(0);
    c.advance(25); expect(c.snapshot().elapsedMs).toBe(50);
  });
});
