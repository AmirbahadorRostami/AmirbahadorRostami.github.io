import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { EXPECTED_PROJECT_SLUGS, sortByOrder } from '../../src/lib/content';
import { collections } from '../../src/content.config';

const contentRoot = resolve(import.meta.dirname, '../../src/content');

const expectedProjects = [
  'encounters',
  'luminous-trails',
  'ephemeral-pulses-of-a-finite-scroll',
  'biowords',
  'person-is-a-data-structure',
];

const expectedExperiments = [
  'Cellular Automata',
  'Experiment 02',
  'Experiment 03',
  'Experiment 04',
  'Experiment 05',
  'Experiment 06',
  'Experiment 07',
];

function readJsonCollection<T = Record<string, unknown>>(collection: string): T[] {
  const directory = resolve(contentRoot, collection);

  if (!existsSync(directory)) return [];

  return readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(readFileSync(resolve(directory, file), 'utf8')) as T);
}

function readProjectCollection(): { id: string; data: Record<string, unknown> }[] {
  const directory = resolve(contentRoot, 'projects');

  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => {
      const source = readFileSync(resolve(directory, name, 'index.md'), 'utf8');
      const [, frontmatter = ''] = source.split(/^---\s*$/m);

      return { id: name, data: parse(frontmatter) };
    });
}

describe('launch inventory', () => {
  it('records the approved project titles, roles, stacks, and contexts', () => {
    const byId = Object.fromEntries(readProjectCollection().map(({ id, data }) => [id, data]));

    expect(byId.encounters).toMatchObject({
      year: '2023',
      context: "Main app-based artistic experience commissioned for Congress 2023 at York University's Keele Campus",
      roles: ['Co-creator', 'Technical Lead', 'Systems architect', 'Client and AR developer'],
      tools: ['Unity', 'AR Foundation', 'ARKit', 'ARCore', 'Node.js', 'AWS'],
      credits: ['Creators: Amir Bahador Rostami and Elahe Rostami', 'Producer: Artifacts Lab'],
    });
    expect(byId['luminous-trails']).toMatchObject({
      year: '2022',
      context: 'Nuit Blanche Toronto 2022',
      roles: ['Lead Technical Architect'],
      tools: ['Unity', 'AR Foundation', 'ARKit', 'ARCore', 'Node.js', 'AWS'],
      credits: [
        'Artifacts Studio Ltd.', 'Roozbeh Moayyedian', 'Elahe Rostami',
        'Amir Bahador Rostami', 'Can Baris Candan', 'Emad Moradian',
      ],
    });
    expect(JSON.stringify(byId['luminous-trails'])).not.toMatch(/mysql|postgres|mongodb/i);
    expect(byId['ephemeral-pulses-of-a-finite-scroll']).toMatchObject({
      title: 'Ephemeral Pulses of a Finite Scroll',
      year: '2020',
      context: 'Remote Realities Themed Commission',
      tools: [
        'Raspberry Pi', 'MPU-6050', 'Python', 'SuperCollider',
        'Audio interface', 'Amplifier', 'Surface transducer',
      ],
      credits: [
        'Creators: Amir Rostami and Elahe Rostami',
        'Co-presenters: Trinity Square Video and Dames Making Games',
        'Supporter: EQ Bank',
      ],
    });
    expect(byId.biowords).toMatchObject({
      year: '2019',
      context: 'York University final project and exhibition',
      collaborators: [],
      credits: ['Solo project by Amir Bahador Rostami'],
    });
    expect(byId['person-is-a-data-structure']).toMatchObject({
      year: '2018',
      roles: ['Technical artist', 'Systems developer'],
      tools: ['Microsoft Azure Face API', 'Max/MSP', 'Processing'],
      collaborators: [],
    });
    expect(byId['person-is-a-data-structure'].context).toContain('Collaborative university installation');
    expect(byId['person-is-a-data-structure'].context).toContain('Eleanor Winters Art Gallery, York University');
    expect(readProjectCollection().filter(({ data }) => data.depth === 'flagship')).toHaveLength(3);
    expect(readProjectCollection().filter(({ data }) => data.depth === 'short')).toHaveLength(2);
  });

  it('keeps the approved work and experiment inventories separate', async () => {
    expect(readProjectCollection().map(({ id }) => id).sort()).toEqual(
      [...expectedProjects].sort(),
    );
    const experiments = sortByOrder(readJsonCollection<{
      title: string;
      order: number;
      state: string;
    }>('experiments').map((data) => ({ data })));
    expect(experiments.map(({ data }) => data.title)).toEqual(expectedExperiments);
    expect(experiments.map(({ data }) => data.state)).toEqual([
      'ready', 'placeholder', 'placeholder', 'placeholder', 'placeholder', 'placeholder', 'placeholder',
    ]);
  });

  it('requires every project media record to describe its fallback', async () => {
    for (const { data } of readProjectCollection()) {
      for (const media of data.media as Record<string, unknown>[]) {
        expect(media).toEqual(expect.objectContaining({
          id: expect.any(String),
          type: expect.stringMatching(/^(image|video|diagram)$/),
          aspectRatio: expect.stringMatching(/^\d+\s*\/\s*\d+$/),
          alt: expect.any(String),
          caption: expect.any(String),
          intention: expect.any(String),
          state: expect.stringMatching(/^(ready|placeholder)$/),
        }));
      }
    }
  });

  it('accepts only HTTPS URLs for externally rendered content links', () => {
    const musicSchema = collections.music.schema;
    if (!musicSchema || typeof musicSchema === 'function') {
      throw new Error('Expected the music collection to expose a direct schema.');
    }
    const baseMusicRecord = {
      title: 'Safe link contract',
      platform: 'direct',
      order: 1,
      featured: false,
      draft: false,
    };

    expect(musicSchema.safeParse({ ...baseMusicRecord, url: 'https://example.com/track.mp3' }).success)
      .toBe(true);
    expect(musicSchema.safeParse({ ...baseMusicRecord, url: 'javascript:alert(1)' }).success)
      .toBe(false);
    expect(musicSchema.safeParse({ ...baseMusicRecord, url: 'data:text/html,<h1>unsafe</h1>' }).success)
      .toBe(false);
    expect(musicSchema.safeParse({ ...baseMusicRecord, url: 'http://example.com/track.mp3' }).success)
      .toBe(false);
  });

  it('contains the five approved project slugs', () => {
    expect(EXPECTED_PROJECT_SLUGS).toEqual([
      'encounters',
      'luminous-trails',
      'ephemeral-pulses-of-a-finite-scroll',
      'biowords',
      'person-is-a-data-structure',
    ]);
  });

  it('has one project record for every approved launch slug', () => {
    const directory = resolve(contentRoot, 'projects');
    const projectSlugs = existsSync(directory)
      ? readdirSync(directory, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .sort()
      : [];

    expect(projectSlugs).toEqual([...EXPECTED_PROJECT_SLUGS].sort());
  });

  it('keeps every project record complete enough for archive and detail consumers', () => {
    for (const slug of EXPECTED_PROJECT_SLUGS) {
      const source = readFileSync(resolve(contentRoot, 'projects', slug, 'index.md'), 'utf8');
      const [, frontmatter = '', body = ''] = source.split(/^---\s*$/m);

      expect(frontmatter, `${slug} frontmatter`).toMatch(/^title:\s*\S/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^summary:\s*\S/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^cardSummary:\s*\S/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^depth:\s*(flagship|short)\s*$/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^order:\s*[1-9]\d*\s*$/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^categories:\s*\[\S/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^roles:\s*\[\S/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^tools:\s*\[\S/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^hero:\s*\.\.\/\.\.\/\.\.\/assets\//m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^heroAlt:\s*\S/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^media:\s*$/m);
      expect(frontmatter, `${slug} frontmatter`).toMatch(/^draft:\s*false\s*$/m);
      expect(body.trim(), `${slug} body`).not.toBe('');
    }
  });

  it('keeps the approved project identity and launch-state contract per slug', () => {
    const expected = {
      encounters: { title: 'Encounters', depth: 'flagship', order: 1, featured: true },
      'luminous-trails': { title: 'Luminous Trails', depth: 'flagship', order: 2, featured: true },
      'ephemeral-pulses-of-a-finite-scroll': {
        title: 'Ephemeral Pulses of a Finite Scroll',
        alternateTitle: 'Remote Realities',
        depth: 'flagship',
        order: 3,
        featured: true,
      },
      biowords: { title: 'BioWords', depth: 'short', order: 4, featured: false },
      'person-is-a-data-structure': { title: 'Person Is a Data Structure', depth: 'short', order: 5, featured: false },
    } as const;

    for (const [slug, record] of Object.entries(expected)) {
      const source = readFileSync(resolve(contentRoot, 'projects', slug, 'index.md'), 'utf8');
      const [, frontmatter = ''] = source.split(/^---\s*$/m);

      expect(frontmatter).toContain(`title: ${record.title}`);
      if ('alternateTitle' in record) {
        expect(frontmatter).toContain(`alternateTitle: ${record.alternateTitle}`);
      }
      expect(frontmatter).toContain(`depth: ${record.depth}`);
      expect(frontmatter).toContain(`order: ${record.order}`);
      expect(frontmatter).toContain(`featured: ${record.featured}`);
      expect(frontmatter).toContain('liveExperiment: false');
    }
  });

  it('keeps the approved timeline at 13 reverse-chronological records without contact details', () => {
    const records = readJsonCollection('experience').sort(
      (left, right) => Number(left.order) - Number(right.order),
    );
    const serialized = JSON.stringify(records);

    expect(records).toHaveLength(13);
    expect(records.map(({ order }) => order)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);
    expect(records.map(({ organization }) => organization)).toEqual([
      'Product Madness',
      'Sector Growth',
      'Artifacts Lab',
      'Hard Rock Digital',
      'Circuit Stream',
      'TerraZero',
      'Infinite Frame Media',
      'Antimodular Research',
      'Studio Above & Below',
      'BMS Lab, University of Twente',
      'AliceLab, York University',
      'Living Architecture Systems Group / Philip Beesley Architect',
      'York University',
    ]);
    expect(serialized).not.toMatch(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
    expect(serialized).not.toMatch(
      /(?:\+?1[\s.-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/,
    );
  });

  it('seeds the five known SoundCloud works and two resolved Spotify tracks', () => {
    const records = readJsonCollection('music').sort(
      (left, right) => Number(left.order) - Number(right.order),
    );

    expect(records.map(({ title }) => title)).toEqual([
      'La Paloma',
      'Float',
      'Flow',
      'Idk',
      'Googoosh - Lalai (Bahador Remake)',
      'Try',
      'Into the Daylight',
    ]);
    expect(records.filter(({ featured }) => featured).map(({ title }) => title)).toEqual([
      'La Paloma',
      'Float',
      'Flow',
    ]);
  });
});
