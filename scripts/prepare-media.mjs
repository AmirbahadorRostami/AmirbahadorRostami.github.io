import { access, copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

/**
 * Selected, canonical masters from the legacy portfolio. Paths are repository-relative
 * so the source-to-destination mapping is reviewable and portable across checkouts.
 */
export const MEDIA_JOBS = [
  {
    project: 'encounters',
    source: 'Media/img-tester/Encounter.png',
    destination: 'src/assets/projects/encounters/encounters-card.webp',
  },
  {
    project: 'encounters',
    source: 'Media/img-tester/EncounterHeader.png',
    destination: 'src/assets/projects/encounters/encounters-header.webp',
  },
  {
    project: 'encounters',
    source: 'Media/img-tester/EncounterInteraction.jpg',
    destination: 'src/assets/projects/encounters/encounters-interaction.webp',
  },
  {
    project: 'encounters',
    source: 'Media/img-tester/EncounterPond.PNG',
    destination: 'src/assets/projects/encounters/encounters-pond.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/Luminous.png',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-card.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/LimnousTrails_0508.JPG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-0508.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/Luminous_Trails_0509.JPG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-0509.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/Luminous_Trails_1796.PNG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-1796.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/Luminous_Trails_1799.PNG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-1799.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/Luminous_Trails_1801.PNG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-1801.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/Luminous_Trails_1844.PNG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-1844.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/luminous_trails-nov12a.PNG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-nov12a.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/img-tester/luminous_trails-nov12b.PNG',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-nov12b.webp',
  },
  {
    project: 'remote-realities',
    source: 'Media/img-tester/Remote.jpg',
    destination: 'src/assets/projects/remote-realities/remote-realities-card.webp',
  },
  {
    project: 'biowords',
    source: 'Media/img-tester/BioWords.gif',
    destination: 'src/assets/projects/biowords/biowords-card.gif',
  },
  {
    project: 'person-is-a-data-structure',
    source: 'Media/img-tester/Data.jpg',
    destination:
      'src/assets/projects/person-is-a-data-structure/person-is-a-data-structure-card.webp',
  },
  {
    project: 'cellular-automata',
    source: 'Media/img-tester/CATumbnail.png',
    destination: 'src/assets/projects/cellular-automata/cellular-automata-card.webp',
  },
  {
    project: 'profile',
    source: 'Media/ProfilePics/Bahador.png',
    destination: 'src/assets/profile/amir-rostami.webp',
  },
];

function sourcePath(job) {
  return resolve(repositoryRoot, job.source);
}

function destinationPath(job) {
  return resolve(repositoryRoot, job.destination);
}

function assertManifest() {
  const destinations = new Set();

  for (const job of MEDIA_JOBS) {
    if (destinations.has(job.destination)) {
      throw new Error(`Duplicate media destination: ${job.destination}`);
    }
    destinations.add(job.destination);

    if (!job.destination.startsWith('src/assets/')) {
      throw new Error(`Media destination must stay in src/assets: ${job.destination}`);
    }

    const isGif = job.destination.endsWith('.gif');
    if (isGif !== (job.source === 'Media/img-tester/BioWords.gif')) {
      throw new Error(`Only the BioWords animation may be copied as GIF: ${job.destination}`);
    }
    if (!isGif && !job.destination.endsWith('.webp')) {
      throw new Error(`Static media must be written as WebP: ${job.destination}`);
    }
  }
}

export async function prepareMedia() {
  assertManifest();

  for (const job of MEDIA_JOBS) {
    const source = sourcePath(job);
    const destination = destinationPath(job);

    try {
      await access(source);
    } catch {
      throw new Error(`Media source is missing: ${job.source}`);
    }

    await mkdir(dirname(destination), { recursive: true });

    if (job.destination.endsWith('.gif')) {
      await copyFile(source, destination);
    } else {
      await sharp(source)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(destination);
    }

    console.log(`${job.source} -> ${job.destination}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prepareMedia().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
