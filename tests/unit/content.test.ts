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

type ExperimentFixture = {
  id: string;
  data: {
    title?: string;
    order: number;
    state: 'ready' | 'placeholder';
  };
};

const projectEntries: ProjectFixture[] = [
  { id: 'ephemeral-pulses-of-a-finite-scroll', data: { title: 'Ephemeral Pulses of a Finite Scroll', order: 3, featured: true, categories: ['technology-art', 'installation'], draft: false } },
  { id: 'draft-project', data: { title: 'Draft Project', order: 0, featured: true, categories: ['private'], draft: true } },
  { id: 'encounters', data: { title: 'Encounters', order: 1, featured: true, categories: ['augmented-reality', 'public-space'], draft: false } },
  { id: 'biowords', data: { title: 'BioWords', order: 4, featured: false, categories: ['generative-art', 'web-experience'], draft: false } },
  { id: 'person-is-a-data-structure', data: { title: 'Person Is a Data Structure', order: 5, featured: false, categories: ['interactive-installation', 'surveillance'], draft: false } },
  { id: 'luminous-trails', data: { title: 'Luminous Trails', order: 2, featured: true, categories: ['augmented-reality', 'geolocation'], draft: false } },
] as const;

const experimentEntries: ExperimentFixture[] = [
  { id: '03-experiment-03', data: { order: 4, state: 'placeholder' } },
  { id: '01-cellular-automata', data: { title: 'Cellular Automata', order: 1, state: 'ready' } },
  { id: '07-experiment-07', data: { order: 7, state: 'placeholder' } },
  { id: '02-experiment-02', data: { order: 3, state: 'placeholder' } },
  { id: '06-experiment-06', data: { order: 6, state: 'placeholder' } },
  { id: '04-experiment-04', data: { order: 5, state: 'placeholder' } },
  { id: '05-experiment-05', data: { title: 'Agent Trails', order: 2, state: 'placeholder' } },
] as const;

let mockedProjectEntries = projectEntries;
let mockedExperimentEntries = experimentEntries;

vi.mock('astro:content', () => ({
  getCollection: async (
    collection: string,
    filter?: (entry: ProjectFixture) => boolean,
  ) => {
    if (collection === 'experiments') return mockedExperimentEntries;
    return filter ? mockedProjectEntries.filter(filter) : mockedProjectEntries;
  },
}));

import {
  getFeaturedProjects,
  getPublishedExperiments,
  getPublishedProjects,
  sortByOrder,
} from '../../src/lib/content';

describe('project query layer', () => {
  beforeEach(() => {
    mockedProjectEntries = projectEntries;
    mockedExperimentEntries = experimentEntries;
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
      'ephemeral-pulses-of-a-finite-scroll',
      'biowords',
      'person-is-a-data-structure',
    ]);
    expect(projects).not.toContainEqual(expect.objectContaining({ id: 'draft-project' }));
  });

  it('returns exactly the three featured published projects', async () => {
    const projects = await getFeaturedProjects();

    expect(projects).toHaveLength(3);
    expect(projects.map(({ data }) => data.title)).toEqual([
      'Encounters',
      'Luminous Trails',
      'Ephemeral Pulses of a Finite Scroll',
    ]);
  });

  it('returns the approved experiments in ascending order', async () => {
    const experiments = await getPublishedExperiments();

    expect(experiments.map(({ id }) => id)).toEqual([
      '01-cellular-automata',
      '05-experiment-05',
      '02-experiment-02',
      '03-experiment-03',
      '04-experiment-04',
      '06-experiment-06',
      '07-experiment-07',
    ]);
    expect(experiments.map(({ data }) => data.title)).toEqual([
      'Cellular Automata', 'Agent Trails', undefined, undefined, undefined, undefined, undefined,
    ]);
  });

  it('names missing and unexpected project records in inventory errors', async () => {
    mockedProjectEntries = [
      ...projectEntries.filter(({ id }) => id !== 'biowords'),
      { id: 'unapproved-work', data: { title: 'Unapproved Work', order: 6, featured: false, categories: ['test'], draft: false } },
    ];

    await expect(getPublishedProjects()).rejects.toThrow(
      'Project inventory mismatch. Missing: biowords. Unexpected: unapproved-work.',
    );
  });

  it('names missing and unexpected experiment records in inventory errors', async () => {
    mockedExperimentEntries = [
      ...experimentEntries.filter(({ id }) => id !== '07-experiment-07'),
      { id: '08-unapproved', data: { title: 'Unapproved Experiment', order: 8, state: 'placeholder' } },
    ];

    await expect(getPublishedExperiments()).rejects.toThrow(
      'Experiment inventory mismatch. Missing: 07-experiment-07. Unexpected: 08-unapproved.',
    );
  });

  it('rejects a duplicate approved experiment ID as an unexpected record', async () => {
    mockedExperimentEntries = [
      ...experimentEntries,
      { id: '07-experiment-07', data: { order: 8, state: 'placeholder' } },
    ];

    await expect(getPublishedExperiments()).rejects.toThrow(
      'Experiment inventory mismatch. Missing: none. Unexpected: 07-experiment-07.',
    );
  });

  it('throws when there are more than three featured published projects', async () => {
    mockedProjectEntries = projectEntries.map((project) => (
      project.id === 'biowords'
        ? { ...project, data: { ...project.data, featured: true } }
        : project
    ));

    await expect(getFeaturedProjects()).rejects.toThrow('Expected exactly three featured projects.');
  });

});
