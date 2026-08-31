import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EXPECTED_PROJECT_SLUGS } from '../../src/lib/content';

const contentRoot = resolve(import.meta.dirname, '../../src/content');

function readJsonCollection(collection: string): Record<string, unknown>[] {
  const directory = resolve(contentRoot, collection);

  if (!existsSync(directory)) return [];

  return readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(readFileSync(resolve(directory, file), 'utf8')));
}

describe('launch inventory', () => {
  it('contains the six approved project slugs', () => {
    expect(EXPECTED_PROJECT_SLUGS).toEqual([
      'encounters',
      'luminous-trails',
      'remote-realities',
      'biowords',
      'person-is-a-data-structure',
      'cellular-automata',
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
