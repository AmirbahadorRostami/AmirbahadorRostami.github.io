import { getCollection, type CollectionEntry } from 'astro:content';

export const EXPECTED_PROJECT_SLUGS = [
  'encounters',
  'luminous-trails',
  'ephemeral-pulses-of-a-finite-scroll',
  'biowords',
  'person-is-a-data-structure',
] as const;

export const EXPECTED_EXPERIMENT_TITLES = [
  'Cellular Automata',
  'Experiment 02',
  'Experiment 03',
  'Experiment 04',
  'Experiment 05',
  'Experiment 06',
  'Experiment 07',
] as const;

type ProjectEntry = CollectionEntry<'projects'>;
type ExperimentEntry = CollectionEntry<'experiments'>;

function assertExpectedInventory(
  inventoryName: string,
  actualRecords: readonly string[],
  expectedRecords: readonly string[],
): void {
  const missing = [...expectedRecords];
  const unexpected: string[] = [];

  for (const record of actualRecords) {
    const expectedIndex = missing.indexOf(record);

    if (expectedIndex === -1) {
      unexpected.push(record);
    } else {
      missing.splice(expectedIndex, 1);
    }
  }

  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      `${inventoryName} inventory mismatch. Missing: ${missing.join(', ') || 'none'}. `
      + `Unexpected: ${unexpected.join(', ') || 'none'}.`,
    );
  }
}

export function adjacentEntries<T extends { id: string }>(
  entries: T[],
  currentId: string,
): { previous: T; next: T } {
  const currentIndex = entries.findIndex(({ id }) => id === currentId);

  if (currentIndex === -1) {
    throw new Error(`Cannot find current project "${currentId}" among published projects.`);
  }

  const previousIndex = (currentIndex - 1 + entries.length) % entries.length;
  const nextIndex = (currentIndex + 1) % entries.length;

  return {
    previous: entries[previousIndex],
    next: entries[nextIndex],
  };
}

export function sortByOrder<T extends { data: { order: number } }>(entries: T[]): T[] {
  return [...entries].sort((left, right) => left.data.order - right.data.order);
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  assertExpectedInventory('Project', projects.map(({ id }) => id), EXPECTED_PROJECT_SLUGS);

  return sortByOrder(projects);
}

export async function getPublishedExperiments(): Promise<ExperimentEntry[]> {
  const experiments = await getCollection('experiments');

  assertExpectedInventory(
    'Experiment',
    experiments.map(({ data }) => data.title),
    EXPECTED_EXPERIMENT_TITLES,
  );

  return sortByOrder(experiments);
}

export async function getAdjacentProject(
  projectId: string,
): Promise<{ previous: ProjectEntry; next: ProjectEntry }> {
  return adjacentEntries(await getPublishedProjects(), projectId);
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const featuredProjects = (await getPublishedProjects()).filter(({ data }) => data.featured);

  if (featuredProjects.length !== 3) {
    throw new Error('Expected exactly three featured projects.');
  }

  return featuredProjects.slice(0, 3);
}
