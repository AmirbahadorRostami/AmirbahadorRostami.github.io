import { getCollection, type CollectionEntry } from 'astro:content';
import { sortByOrder } from '../lib/content';

export const FEATURED_PROJECT_IDS = [
  'encounters',
  'luminous-trails',
  'remote-realities',
] as const;

export const FEATURED_TRACK_TITLES = ['Float', 'Flow', 'La Paloma'] as const;

export const DESIGN_LAB_IDENTITY =
  'Creative tinkerer. Musician. Professional maker of curious things.';

export const DESIGN_LAB_SUPPORTING_STATEMENT =
  'I create immersive experiences, software, and sound that bring people together in unexpected ways.';

export interface DesignLabContent {
  projects: CollectionEntry<'projects'>[];
  music: CollectionEntry<'music'>[];
  experience: CollectionEntry<'experience'>[];
}

function selectInOrder<T>(
  entries: T[],
  approvedValues: readonly string[],
  valueFor: (entry: T) => string,
  label: string,
): T[] {
  return approvedValues.map((approvedValue) => {
    const entry = entries.find((candidate) => valueFor(candidate) === approvedValue);

    if (!entry) {
      throw new Error(`Missing approved design lab ${label} "${approvedValue}".`);
    }

    return entry;
  });
}

export async function loadDesignLabContent(): Promise<DesignLabContent> {
  const [projectEntries, musicEntries, experienceEntries] = await Promise.all([
    getCollection('projects'),
    getCollection('music'),
    getCollection('experience'),
  ]);

  const projects = sortByOrder(
    projectEntries.filter(({ data }) => data.featured && !data.draft),
  );
  const music = sortByOrder(
    musicEntries.filter(({ data }) => data.featured && !data.draft),
  );
  const experience = sortByOrder(
    experienceEntries.filter(({ data }) => data.featured),
  );

  return {
    projects: selectInOrder(projects, FEATURED_PROJECT_IDS, ({ id }) => id, 'project'),
    music: selectInOrder(music, FEATURED_TRACK_TITLES, ({ data }) => data.title, 'track'),
    experience,
  };
}
