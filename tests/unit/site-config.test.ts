import { describe, expect, it } from 'vitest';
import { SITE } from '../../src/config/site';

describe('SITE', () => {
  it('contains only public contact details', () => {
    expect(SITE.location).toBe('Toronto, Canada');
    expect(JSON.stringify(SITE)).not.toMatch(/427-2821|bahador\.rostami95@gmail\.com/i);
  });

  it('exposes the approved global navigation in order', () => {
    expect(SITE.navigation.map((item) => item.label)).toEqual([
      'Work',
      'Experiments',
      'Music',
      'About',
      'Contact',
    ]);
  });

  it('describes Amir with the approved public identity', () => {
    expect(SITE.name).toBe('Amir Bahador Rostami');
    expect(SITE.title).toBe('Amir Bahador Rostami — Creative Technologist & Musician');
    expect(SITE.description).toBe(
      'Portfolio of Amir Bahador Rostami, a Toronto creative technologist and musician building interactive systems, immersive artworks, digital experiences, and sound.',
    );
  });
});
