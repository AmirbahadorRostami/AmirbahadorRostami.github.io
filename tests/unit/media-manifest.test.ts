import { describe, expect, it } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import sharp from 'sharp';
import { MEDIA_JOBS } from '../../scripts/prepare-media.mjs';

const repositoryRoot = resolve(import.meta.dirname, '../..');

describe('media manifest', () => {
  it('has a hero image for every launch project', () => {
    expect(new Set(MEDIA_JOBS.map((job) => job.project))).toEqual(
      new Set([
        'encounters',
        'luminous-trails',
        'remote-realities',
        'biowords',
        'person-is-a-data-structure',
        'cellular-automata',
        'profile',
      ]),
    );
  });

  it('assigns every media job a unique stable destination', () => {
    const destinations = MEDIA_JOBS.map((job) => job.destination);

    expect(new Set(destinations)).toHaveLength(destinations.length);
    expect(destinations).toEqual(
      expect.arrayContaining([
        'src/assets/projects/encounters/encounters-card.webp',
        'src/assets/projects/luminous-trails/luminous-trails-card.webp',
        'src/assets/projects/remote-realities/remote-realities-card.webp',
        'src/assets/projects/biowords/biowords-card.gif',
        'src/assets/projects/biowords/biowords-card.webp',
        'src/assets/projects/person-is-a-data-structure/person-is-a-data-structure-card.webp',
        'src/assets/projects/cellular-automata/cellular-automata-card.webp',
        'src/assets/profile/amir-rostami.webp',
      ]),
    );
  });

  it('keeps sources and generated outputs inside their approved repository roots', async () => {
    await Promise.all(MEDIA_JOBS.map(async (job) => {
      const source = resolve(repositoryRoot, job.source);
      const destination = resolve(repositoryRoot, job.destination);
      const sourceRelative = relative(resolve(repositoryRoot, 'Media'), source);
      const destinationRelative = relative(resolve(repositoryRoot, 'src/assets'), destination);

      expect(sourceRelative).not.toMatch(/^\.\.(?:[\\/]|$)/);
      expect(destinationRelative).not.toMatch(/^\.\.(?:[\\/]|$)/);
      expect(job.source).not.toMatch(/(?:^|[\\/])\.\.(?:[\\/]|$)/);
      expect(job.destination).not.toMatch(/(?:^|[\\/])\.\.(?:[\\/]|$)/);
      await expect(access(source)).resolves.toBeUndefined();
      await expect(access(destination)).resolves.toBeUndefined();
    }));
  });

  it('keeps every static generated output readable as WebP within 1920px bounds', async () => {
    const staticJobs = MEDIA_JOBS.filter((job) => job.destination.endsWith('.webp'));

    await Promise.all(staticJobs.map(async (job) => {
      const metadata = await sharp(resolve(repositoryRoot, job.destination)).metadata();

      expect(metadata.format, job.destination).toBe('webp');
      expect(metadata.width, job.destination).toBeLessThanOrEqual(1920);
      expect(metadata.height, job.destination).toBeLessThanOrEqual(1920);
    }));
  });

  it('uses WebP for static masters and preserves the BioWords GIF', () => {
    const gifJobs = MEDIA_JOBS.filter((job) => job.destination.endsWith('.gif'));
    const staticJobs = MEDIA_JOBS.filter((job) => !job.destination.endsWith('.gif'));

    expect(gifJobs).toEqual([
      expect.objectContaining({
        project: 'biowords',
        source: 'Media/img-tester/BioWords.gif',
        destination: 'src/assets/projects/biowords/biowords-card.gif',
        operation: 'copy',
      }),
    ]);
    expect(MEDIA_JOBS).toContainEqual(expect.objectContaining({
      project: 'biowords',
      source: 'Media/img-tester/BioWords.gif',
      destination: 'src/assets/projects/biowords/biowords-card.webp',
      operation: 'first-frame',
    }));
    expect(staticJobs.every((job) => job.destination.endsWith('.webp'))).toBe(true);
  });

  it('keeps the BioWords animation byte-identical and generates a one-frame hero', async () => {
    const source = resolve(repositoryRoot, 'Media/img-tester/BioWords.gif');
    const preservedAnimation = resolve(
      repositoryRoot,
      'src/assets/projects/biowords/biowords-card.gif',
    );
    const staticHero = resolve(
      repositoryRoot,
      'src/assets/projects/biowords/biowords-card.webp',
    );

    const [sourceBytes, preservedBytes, sourceMetadata, preservedMetadata, stillMetadata] = await Promise.all([
      readFile(source),
      readFile(preservedAnimation),
      sharp(source).metadata(),
      sharp(preservedAnimation).metadata(),
      sharp(staticHero).metadata(),
    ]);

    expect(preservedBytes.equals(sourceBytes)).toBe(true);
    expect(sourceMetadata.pages).toBeGreaterThan(1);
    expect(preservedMetadata.pages).toBe(sourceMetadata.pages);
    expect(stillMetadata.format).toBe('webp');
    expect(stillMetadata.pages ?? 1).toBe(1);
  });

  it('keeps the selected Luminous Trails detail sources available for project pages', () => {
    expect(MEDIA_JOBS.filter((job) => job.project === 'luminous-trails').map((job) => job.source)).toEqual([
      'Media/img-tester/Luminous.png',
      'Media/img-tester/LimnousTrails_0508.JPG',
      'Media/img-tester/Luminous_Trails_0509.JPG',
      'Media/img-tester/Luminous_Trails_1796.PNG',
      'Media/img-tester/Luminous_Trails_1799.PNG',
      'Media/img-tester/Luminous_Trails_1801.PNG',
      'Media/img-tester/Luminous_Trails_1844.PNG',
      'Media/img-tester/luminous_trails-nov12a.PNG',
      'Media/img-tester/luminous_trails-nov12b.PNG',
    ]);
  });
});
