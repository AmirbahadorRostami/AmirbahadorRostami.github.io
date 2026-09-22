import { describe, expect, it } from 'vitest';
import { projectChapters } from '../../src/lib/project-chapters';

describe('projectChapters', () => {
  it('groups authored HTML using content-owned chapter markers and preserves body content', () => {
    const chapters = projectChapters('<!-- chapter:experience --><h2 id="invitation">The invitation</h2><p>Walk together.</p><!-- chapter:contribution --><h2>My contribution</h2><p>I made the client.</p><!-- chapter:credits --><p>Public context.</p>');
    expect(chapters.experience).toBe('<h3 id="invitation">The invitation</h3><p>Walk together.</p>');
    expect(chapters.contribution).toBe('<h3>My contribution</h3><p>I made the client.</p>');
    expect(chapters.credits).toBe('<p>Public context.</p>');
    expect(chapters.technical).toBe('');
    expect(chapters.process).toBe('');
  });

  it('retains unannotated content and repeated chapter sections instead of dropping them', () => {
    const chapters = projectChapters('<p>Introduction.</p><!-- chapter:experience --><p>First.</p><!-- chapter:experience --><p>Second.</p>');
    expect(chapters.experience).toContain('<p>Introduction.</p>');
    expect(chapters.experience).toContain('<p>First.</p>');
    expect(chapters.experience).toContain('<p>Second.</p>');
  });
});
