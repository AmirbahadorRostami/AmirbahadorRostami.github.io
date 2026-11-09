import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog');
  return posts.filter(({ data }) => !data.draft).sort((left, right) => (
    right.data.pubDate.getTime() - left.data.pubDate.getTime() || left.id.localeCompare(right.id)
  ));
}

export function formatBlogDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(date);
}
