import { describe, expect, it } from 'vitest';
import { absoluteUrl, normalizePath } from '../../src/lib/urls';

describe('URL helpers', () => {
  it('normalizes internal routes with a leading and trailing slash', () => {
    expect(normalizePath('work/encounters')).toBe('/work/encounters/');
  });

  it('builds canonical URLs from the configured origin', () => {
    expect(absoluteUrl('/music/')).toBe('https://amirbahadorrostami.github.io/music/');
  });
});
