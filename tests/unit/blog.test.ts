import { describe, expect, it, vi } from 'vitest';
import { collections } from '../../src/content.config';

const entries = [
  { id: 'older', data: { pubDate: new Date('2026-10-01'), draft: false } },
  { id: 'unfinished', data: { pubDate: new Date('2026-11-06'), draft: true } },
  { id: 'newer', data: { pubDate: new Date('2026-11-01'), draft: false } },
];

vi.mock('astro:content', async (importOriginal) => ({
  ...await importOriginal<typeof import('astro:content')>(),
  getCollection: async () => entries,
}));

import { formatBlogDate, getPublishedBlogPosts } from '../../src/lib/blog';

describe('blog publishing', () => {
  it('excludes drafts and lists published posts newest first', async () => {
    expect((await getPublishedBlogPosts()).map(({ id }) => id)).toEqual(['newer', 'older']);
    expect(entries.map(({ id }) => id)).toEqual(['older', 'unfinished', 'newer']);
  });

  it('keeps date-only publication dates on the same day in every time zone', () => {
    expect(formatBlogDate(new Date('2026-11-06T00:00:00Z'))).toBe('November 6, 2026');
  });

  it('defaults new posts to drafts and rejects missing descriptions and invalid dates', () => {
    const schema = collections.blog.schema;
    if (!schema || typeof schema === 'function') throw new Error('Expected a direct blog schema.');
    const valid = { title: 'A post', description: 'A short introduction.', pubDate: '2026-11-06' };
    expect(schema.parse(valid)).toMatchObject({ draft: true, pubDate: new Date('2026-11-06') });
    expect(schema.safeParse({ ...valid, description: ' ' }).success).toBe(false);
    expect(schema.safeParse({ ...valid, pubDate: '2026-02-30' }).success).toBe(false);
    expect(schema.safeParse({ ...valid, pubDate: 'tomorrow' }).success).toBe(false);
    expect(schema.safeParse({ ...valid, title: '' }).success).toBe(false);
  });
});
