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
      'ephemeral-pulses-of-a-finite-scroll': { title: 'Remote Realities', depth: 'flagship', order: 3, featured: true },
      biowords: { title: 'BioWords', depth: 'short', order: 4, featured: false },
      'person-is-a-data-structure': { title: 'Person Is a Data Structure', depth: 'short', order: 5, featured: false },
    } as const;

    for (const [slug, record] of Object.entries(expected)) {
      const source = readFileSync(resolve(contentRoot, 'projects', slug, 'index.md'), 'utf8');
      const [, frontmatter = ''] = source.split(/^---\s*$/m);

      expect(frontmatter).toContain(`title: ${record.title}`);
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
