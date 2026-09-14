import { describe, expect, it } from 'vitest';
import { DESIGN_CONCEPTS, designConceptBySlug } from '../../src/design-lab/manifest';

describe('design lab manifest', () => {
  it('defines the six approved concepts in comparison order', () => {
    expect(DESIGN_CONCEPTS.map(({ slug }) => slug)).toEqual([
      'poster-index',
      'type-image-collision',
      'darkroom-cinema',
      'printed-signal-lab',
      'coral-broadcast',
      'clau-poster-wall',
    ]);
  });

  it('uses a non-system display family and resolves every slug', () => {
    expect(new Set(DESIGN_CONCEPTS.map(({ font }) => font)).size).toBe(4);
    expect(DESIGN_CONCEPTS.every(({ slug }) => designConceptBySlug(slug)?.slug === slug)).toBe(true);
    expect(DESIGN_CONCEPTS.every(({ font }) => !/inter|system-ui/i.test(font))).toBe(true);
  });
});
