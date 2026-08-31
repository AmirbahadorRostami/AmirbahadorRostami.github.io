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
      'Music',
      'About',
      'Contact',
    ]);
  });
});
