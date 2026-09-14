import { describe, expect, it } from 'vitest';
import { FEATURED_PROJECT_IDS, FEATURED_TRACK_TITLES } from '../../src/design-lab/content';

describe('design lab content contract', () => {
  it('keeps the approved flagship and music order', () => {
    expect(FEATURED_PROJECT_IDS).toEqual(['encounters', 'luminous-trails', 'remote-realities']);
    expect(FEATURED_TRACK_TITLES).toEqual(['Float', 'Flow', 'La Paloma']);
  });
});
