import { describe, expect, it } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import sharp from 'sharp';
import { MEDIA_JOBS, prepareMedia } from '../../scripts/prepare-media.mjs';

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

  it('prepares the supplied Encounters title mark for the project hero', () => {
    expect(MEDIA_JOBS).toContainEqual(expect.objectContaining({
      source: 'Media/final/projects/encounters/hero.png',
      destination: 'src/assets/projects/encounters/encounters-wordmark.webp',
    }));
  });

  it('publishes the BioWords hero, four isolated letters, four alphabet studies, and LOVE example', () => {
    const jobs = MEDIA_JOBS.filter((job) => job.project === 'biowords');
    expect(jobs).toContainEqual(expect.objectContaining({
      source: 'Media/final/projects/biowords/hero.png',
      destination: 'src/assets/projects/biowords/biowords-hero.webp',
    }));
    for (const letter of ['L', 'O', 'V', 'E']) {
      expect(jobs).toContainEqual(expect.objectContaining({
        source: `Media/final/projects/biowords/Single/${letter}.png`,
        destination: `src/assets/projects/biowords/single-${letter.toLowerCase()}.webp`,
      }));
      expect(jobs).toContainEqual(expect.objectContaining({
        source: `Media/final/projects/biowords/Layerd/${letter}.png`,
        destination: `src/assets/projects/biowords/layered-${letter.toLowerCase()}.webp`,
      }));
    }
    expect(jobs).toContainEqual(expect.objectContaining({
      destination: 'src/assets/projects/biowords/love-example.webp',
      operation: 'compose-letters',
      letters: ['L', 'O', 'V', 'E'],
    }));
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
      // Owner-supplied masters are local-only; CI verifies their published derivatives.
      if (!job.source.startsWith('Media/final/')) {
        await expect(access(source)).resolves.toBeUndefined();
      }
      await expect(access(destination)).resolves.toBeUndefined();
    }));
  });

  it('rejects a lexically valid destination that resolves outside src/assets', async () => {
    const originalJobs = [...MEDIA_JOBS];

    try {
      MEDIA_JOBS.splice(0, MEDIA_JOBS.length, {
        project: 'escape-attempt',
        source: 'Media/definitely-missing.png',
        destination: 'src/assets/../../escaped.webp',
      });

      await expect(prepareMedia()).rejects.toThrow('Media destination must stay in src/assets');
    } finally {
      MEDIA_JOBS.splice(0, MEDIA_JOBS.length, ...originalJobs);
    }
  });

  it('keeps every static generated output readable as WebP within its image bounds', async () => {
    const staticJobs = MEDIA_JOBS.filter((job) => job.destination.endsWith('.webp'));

    await Promise.all(staticJobs.map(async (job) => {
      const metadata = await sharp(resolve(repositoryRoot, job.destination)).metadata();

      expect(metadata.format, job.destination).toBe('webp');
      expect(metadata.width, job.destination).toBeLessThanOrEqual(job.maxWidth ?? 1920);
      expect(metadata.height, job.destination).toBeLessThanOrEqual(job.maxHeight ?? 1920);
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

  it('regenerates the published Luminous Trails images from the selected final masters', () => {
    expect(MEDIA_JOBS.filter((job) => job.project === 'luminous-trails').map(({ source, destination }) => ({ source, destination }))).toEqual([
      { source: 'Media/final/projects/luminous-trails/hero.png', destination: 'src/assets/projects/luminous-trails/luminous-trails-card.webp' },
      { source: 'Media/final/projects/luminous-trails/nuit-blanche-booth.jpg', destination: 'src/assets/projects/luminous-trails/event-booth.webp' },
      { source: 'Media/final/projects/luminous-trails/participants-documentation-1.jpg', destination: 'src/assets/projects/luminous-trails/participant-documentation.webp' },
      { source: 'Media/final/projects/luminous-trails/participant-trail-3.PNG', destination: 'src/assets/projects/luminous-trails/ar-trails-intersections.webp' },
      { source: 'Media/final/projects/luminous-trails/participant-trail-2.PNG', destination: 'src/assets/projects/luminous-trails/ar-avatar.webp' },
      { source: 'Media/final/projects/luminous-trails/UI.jpg', destination: 'src/assets/projects/luminous-trails/app-journey.webp' },
      { source: 'Media/final/projects/luminous-trails/UI_1.jpg', destination: 'src/assets/projects/luminous-trails/app-avatar.webp' },
    ]);
  });
});
