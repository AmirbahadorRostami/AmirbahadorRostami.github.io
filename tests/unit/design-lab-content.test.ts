import { describe, expect, it, vi } from 'vitest';

const collectionEntries = {
  projects: [
    { id: 'luminous-trails', data: { title: 'Luminous Trails', order: 2, featured: true, draft: false } },
    {
      id: 'ephemeral-pulses-of-a-finite-scroll',
      data: {
        title: 'Ephemeral Pulses of a Finite Scroll',
        alternateTitle: 'Remote Realities',
        order: 3,
        featured: true,
        draft: false,
      },
    },
    { id: 'encounters', data: { title: 'Encounters', order: 1, featured: true, draft: false } },
  ],
  music: [
    { id: 'la-paloma', data: { title: 'La Paloma', order: 1, featured: true, draft: false } },
    { id: 'float', data: { title: 'Float', order: 2, featured: true, draft: false } },
    { id: 'flow', data: { title: 'Flow', order: 3, featured: true, draft: false } },
  ],
  experience: [],
};

vi.mock('astro:content', () => ({
  getCollection: async (collection: keyof typeof collectionEntries) => collectionEntries[collection],
}));

import {
  DESIGN_LAB_IDENTITY,
  DESIGN_LAB_SUPPORTING_STATEMENT,
  FEATURED_PROJECT_IDS,
  FEATURED_TRACK_TITLES,
  loadDesignLabContent,
} from '../../src/design-lab/content';

describe('design lab content contract', () => {
  it('keeps the approved flagship and music order', () => {
    expect(FEATURED_PROJECT_IDS).toEqual([
      'encounters',
      'luminous-trails',
      'ephemeral-pulses-of-a-finite-scroll',
    ]);
    expect(FEATURED_TRACK_TITLES).toEqual(['Float', 'Flow', 'La Paloma']);
  });

  it('selects the renamed project while preserving the design lab display title', async () => {
    const { projects } = await loadDesignLabContent();

    expect(projects.map(({ id }) => id)).toEqual([
      'encounters',
      'luminous-trails',
      'ephemeral-pulses-of-a-finite-scroll',
    ]);
    expect(projects.map(({ data }) => data.title)).toEqual([
      'Encounters',
      'Luminous Trails',
      'Remote Realities',
    ]);
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
