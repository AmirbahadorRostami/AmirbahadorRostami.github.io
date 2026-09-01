import { getCollection, type CollectionEntry } from 'astro:content';

export const EXPECTED_PROJECT_SLUGS = [
  'encounters',
  'luminous-trails',
  'remote-realities',
  'biowords',
  'person-is-a-data-structure',
  'cellular-automata',
] as const;

type ProjectEntry = CollectionEntry<'projects'>;

export function sortByOrder<T extends { data: { order: number } }>(entries: T[]): T[] {
  return [...entries].sort((left, right) => left.data.order - right.data.order);
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  return sortByOrder(projects);
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const featuredProjects = (await getPublishedProjects()).filter(({ data }) => data.featured);

  if (featuredProjects.length !== 3) {
    throw new Error('Expected exactly three featured projects.');
  }

  return featuredProjects.slice(0, 3);
}

export async function getProjectCategories(): Promise<string[]> {
  const projects = await getPublishedProjects();

  return [...new Set(projects.flatMap(({ data }) => data.categories))].sort((left, right) => (
    left.localeCompare(right)
  ));
}
