import { describe, expect, it } from 'vitest';
import {
  DESIGN_LAB_IDENTITY,
  DESIGN_LAB_SUPPORTING_STATEMENT,
  FEATURED_PROJECT_IDS,
  FEATURED_TRACK_TITLES,
} from '../../src/design-lab/content';

describe('design lab content contract', () => {
  it('keeps the approved flagship and music order', () => {
    expect(FEATURED_PROJECT_IDS).toEqual(['encounters', 'luminous-trails', 'remote-realities']);
    expect(FEATURED_TRACK_TITLES).toEqual(['Float', 'Flow', 'La Paloma']);
  });

  it('exports the approved shared identity copy', () => {
    expect(DESIGN_LAB_IDENTITY).toBe(
      'Creative tinkerer. Musician. Professional maker of curious things.',
    );
    expect(DESIGN_LAB_SUPPORTING_STATEMENT).toBe(
      'I create immersive experiences, software, and sound that bring people together in unexpected ways.',
    );
  });
});
