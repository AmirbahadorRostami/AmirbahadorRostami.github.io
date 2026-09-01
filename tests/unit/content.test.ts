import { beforeEach, describe, expect, it, vi } from 'vitest';

type ProjectFixture = {
  id: string;
  data: {
    title: string;
    order: number;
    featured: boolean;
    categories: string[];
    draft: boolean;
  };
};

const projectEntries: ProjectFixture[] = [
  { id: 'remote-realities', data: { title: 'Remote Realities', order: 3, featured: true, categories: ['technology-art', 'installation'], draft: false } },
  { id: 'draft-project', data: { title: 'Draft Project', order: 0, featured: true, categories: ['private'], draft: true } },
  { id: 'encounters', data: { title: 'Encounters', order: 1, featured: true, categories: ['augmented-reality', 'public-space'], draft: false } },
  { id: 'biowords', data: { title: 'BioWords', order: 4, featured: false, categories: ['generative-art', 'web-experience'], draft: false } },
  { id: 'luminous-trails', data: { title: 'Luminous Trails', order: 2, featured: true, categories: ['augmented-reality', 'geolocation'], draft: false } },
] as const;

let mockedProjectEntries = projectEntries;

vi.mock('astro:content', () => ({
  getCollection: async (
    collection: string,
    filter?: (entry: ProjectFixture) => boolean,
  ) => (collection === 'projects' && filter ? mockedProjectEntries.filter(filter) : mockedProjectEntries),
}));

import {
  getFeaturedProjects,
  getProjectCategories,
  getPublishedProjects,
  sortByOrder,
} from '../../src/lib/content';

describe('project query layer', () => {
  beforeEach(() => {
    mockedProjectEntries = projectEntries;
  });

  it('sorts entries into ascending project order without mutating the input', () => {
    const entries = [{ data: { order: 2 } }, { data: { order: 1 } }];

    expect(sortByOrder(entries)).toEqual([
      { data: { order: 1 } },
      { data: { order: 2 } },
    ]);
    expect(entries).toEqual([{ data: { order: 2 } }, { data: { order: 1 } }]);
  });

  it('returns only published projects in ascending order', async () => {
    const projects = await getPublishedProjects();

    expect(projects.map(({ id }) => id)).toEqual([
      'encounters',
      'luminous-trails',
      'remote-realities',
      'biowords',
    ]);
    expect(projects).not.toContainEqual(expect.objectContaining({ id: 'draft-project' }));
  });

  it('returns exactly the three featured published projects', async () => {
    const projects = await getFeaturedProjects();

    expect(projects).toHaveLength(3);
    expect(projects.map(({ data }) => data.title)).toEqual([
      'Encounters',
      'Luminous Trails',
      'Remote Realities',
    ]);
  });

  it('throws when there are more than three featured published projects', async () => {
    mockedProjectEntries = projectEntries.map((project) => (
      project.id === 'biowords'
        ? { ...project, data: { ...project.data, featured: true } }
        : project
    ));

    await expect(getFeaturedProjects()).rejects.toThrow('Expected exactly three featured projects.');
  });

  it('returns de-duplicated alphabetical categories from published projects', async () => {
    await expect(getProjectCategories()).resolves.toEqual([
      'augmented-reality',
      'generative-art',
      'geolocation',
      'installation',
      'public-space',
      'technology-art',
      'web-experience',
    ]);
  });
});
