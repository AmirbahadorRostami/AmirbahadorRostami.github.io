import { describe, expect, it } from 'vitest';
import { MEDIA_JOBS } from '../../scripts/prepare-media.mjs';

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
        'src/assets/projects/person-is-a-data-structure/person-is-a-data-structure-card.webp',
        'src/assets/projects/cellular-automata/cellular-automata-card.webp',
        'src/assets/profile/amir-rostami.webp',
      ]),
    );
  });

  it('uses WebP for static masters and preserves the BioWords GIF', () => {
    const gifJobs = MEDIA_JOBS.filter((job) => job.destination.endsWith('.gif'));
    const staticJobs = MEDIA_JOBS.filter((job) => !job.destination.endsWith('.gif'));

    expect(gifJobs).toEqual([
      expect.objectContaining({
        project: 'biowords',
        source: 'Media/img-tester/BioWords.gif',
        destination: 'src/assets/projects/biowords/biowords-card.gif',
      }),
    ]);
    expect(staticJobs.every((job) => job.destination.endsWith('.webp'))).toBe(true);
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
