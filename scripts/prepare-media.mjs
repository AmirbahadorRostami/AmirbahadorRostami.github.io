import { access, copyFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const assetRoot = resolve(repositoryRoot, 'src/assets');

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
    source: 'Media/final/projects/encounters/hero.png',
    destination: 'src/assets/projects/encounters/encounters-wordmark.webp',
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
    source: 'Media/final/projects/luminous-trails/hero.png',
    destination: 'src/assets/projects/luminous-trails/luminous-trails-card.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/final/projects/luminous-trails/nuit-blanche-booth.jpg',
    destination: 'src/assets/projects/luminous-trails/event-booth.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/final/projects/luminous-trails/participants-documentation-1.jpg',
    destination: 'src/assets/projects/luminous-trails/participant-documentation.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/final/projects/luminous-trails/participant-trail-3.PNG',
    destination: 'src/assets/projects/luminous-trails/ar-trails-intersections.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/final/projects/luminous-trails/participant-trail-2.PNG',
    destination: 'src/assets/projects/luminous-trails/ar-avatar.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/final/projects/luminous-trails/UI.jpg',
    destination: 'src/assets/projects/luminous-trails/app-journey.webp',
  },
  {
    project: 'luminous-trails',
    source: 'Media/final/projects/luminous-trails/UI_1.jpg',
    destination: 'src/assets/projects/luminous-trails/app-avatar.webp',
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
    operation: 'copy',
  },
  {
    project: 'biowords',
    source: 'Media/img-tester/BioWords.gif',
    destination: 'src/assets/projects/biowords/biowords-card.webp',
    operation: 'first-frame',
  },
  {
    project: 'biowords',
    source: 'Media/final/projects/biowords/hero.png',
    destination: 'src/assets/projects/biowords/biowords-hero.webp',
  },
  ...['L', 'O', 'V', 'E'].flatMap((letter) => [
    {
      project: 'biowords',
      source: `Media/final/projects/biowords/Single/${letter}.png`,
      destination: `src/assets/projects/biowords/single-${letter.toLowerCase()}.webp`,
      crop: { left: 240, top: 240, width: 320, height: 320 },
      maxWidth: 320,
      maxHeight: 320,
    },
    {
      project: 'biowords',
      source: `Media/final/projects/biowords/Layerd/${letter}.png`,
      destination: `src/assets/projects/biowords/layered-${letter.toLowerCase()}.webp`,
      crop: { left: 240, top: 240, width: 320, height: 320 },
      maxWidth: 320,
      maxHeight: 320,
    },
  ]),
  {
    project: 'biowords',
    source: 'Media/final/projects/biowords/Layerd/A.png',
    destination: 'src/assets/projects/biowords/love-example.webp',
    operation: 'compose-letters',
    letters: ['L', 'O', 'V', 'E'],
    crop: { left: 240, top: 240, width: 320, height: 320 },
    maxWidth: 320,
    maxHeight: 320,
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
  {
    project: 'encounters',
    source: 'Media/final/projects/encounters/invitation-pairing-interface.PNG',
    destination: 'src/assets/projects/encounters/invitation-pairing-interface.webp',
  },
  {
    project: 'encounters',
    source: 'Media/final/projects/encounters/onboarding-1.PNG',
    destination: 'src/assets/projects/encounters/onboarding-1.webp',
  },
  {
    project: 'encounters',
    source: 'Media/final/projects/encounters/encounters-system-diagram.png',
    destination: 'src/assets/projects/encounters/interaction-flowchart.webp',
    maxWidth: 8000,
    maxHeight: 3000,
  },
  {
    project: 'encounters',
    source: 'Media/final/projects/encounters/campus-map-process.png',
    destination: 'src/assets/projects/encounters/campus-map-process.webp',
  },
  {
    project: 'remote-realities',
    source: 'Media/final/projects/ephemeral-pulses-of-a-finite-scroll/IMG_1036.JPG',
    destination: 'src/assets/projects/remote-realities/participant-interaction.webp',
  },
  {
    project: 'remote-realities',
    source: 'Media/final/projects/ephemeral-pulses-of-a-finite-scroll/IMG_0968.JPG',
    destination: 'src/assets/projects/remote-realities/sculptural-overview.webp',
  },
  {
    project: 'remote-realities',
    source: 'Media/final/projects/ephemeral-pulses-of-a-finite-scroll/Pendulum Synth SystemDiagram .jpg',
    destination: 'src/assets/projects/remote-realities/sound-unit-architecture.webp',
  },
  {
    project: 'remote-realities',
    source: 'Media/final/projects/ephemeral-pulses-of-a-finite-scroll/hardware-components.jpg',
    destination: 'src/assets/projects/remote-realities/hardware-components.webp',
  },
  {
    project: 'remote-realities',
    source: 'Media/final/projects/ephemeral-pulses-of-a-finite-scroll/floor-plan.jpg',
    destination: 'src/assets/projects/remote-realities/directional-key-mapping.webp',
  },
  {
    project: 'remote-realities',
    source: 'Media/final/projects/ephemeral-pulses-of-a-finite-scroll/IMG_0951.JPG',
    destination: 'src/assets/projects/remote-realities/installed-swing-detail.webp',
  },
  {
    project: 'person-is-a-data-structure',
    source: 'Media/final/projects/person-is-a-data-structure/IMG_4637.JPG',
    destination: 'src/assets/projects/person-is-a-data-structure/gallery-installation.webp',
  },
  {
    project: 'person-is-a-data-structure',
    source: 'Media/final/projects/person-is-a-data-structure/hardware-diagram.png',
    destination: 'src/assets/projects/person-is-a-data-structure/system-overview.webp',
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

    const resolvedDestination = destinationPath(job);
    const assetRelativeDestination = relative(assetRoot, resolvedDestination);
    if (
      isAbsolute(assetRelativeDestination)
      || assetRelativeDestination === '..'
      || assetRelativeDestination.startsWith(`..${sep}`)
    ) {
      throw new Error(`Media destination must stay in src/assets: ${job.destination}`);
    }

    const operation = job.operation ?? 'optimize';
    if (!['optimize', 'copy', 'first-frame', 'heic', 'compose-letters'].includes(operation)) {
      throw new Error(`Unknown media operation "${operation}": ${job.destination}`);
    }

    if (operation === 'copy') {
      if (
        job.source !== 'Media/img-tester/BioWords.gif'
        || job.destination !== 'src/assets/projects/biowords/biowords-card.gif'
      ) {
        throw new Error(`Only the preserved BioWords animation may use copy: ${job.destination}`);
      }
    } else if (!job.destination.endsWith('.webp')) {
      throw new Error(`Processed media must be written as WebP: ${job.destination}`);
    }

    if (
      operation === 'first-frame'
      && job.source !== 'Media/img-tester/BioWords.gif'
    ) {
      throw new Error(`First-frame extraction is reserved for BioWords: ${job.source}`);
    }

    if (operation === 'heic' && !/\.heic$/i.test(job.source)) {
      throw new Error(`HEIC decoding requires a HEIC source: ${job.source}`);
    }
    if (operation === 'compose-letters' && (
      job.source !== 'Media/final/projects/biowords/Layerd/A.png'
      || job.letters?.join('') !== 'LOVE'
    )) {
      throw new Error(`Letter composition requires the BioWords LOVE sources: ${job.source}`);
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

    const operation = job.operation ?? 'optimize';

    if (operation === 'copy') {
      await copyFile(source, destination);
    } else if (operation === 'compose-letters') {
      const layers = job.letters.map((letter) => ({
        input: resolve(repositoryRoot, `Media/final/projects/biowords/Single/${letter}.png`),
        blend: 'multiply',
      }));
      await Promise.all(layers.map(({ input }) => access(input)));
      const composed = await sharp(source).composite(layers).png().toBuffer();
      await sharp(composed).extract(job.crop).webp({ quality: 90 }).toFile(destination);
    } else {
      const inputOptions = operation === 'first-frame' ? { page: 0, pages: 1 } : undefined;
      const input = operation === 'heic'
        ? (await execFileAsync('ffmpeg', [
          '-loglevel', 'error', '-i', source, '-frames:v', '1',
          '-f', 'image2pipe', '-vcodec', 'png', '-',
        ], { encoding: 'buffer', maxBuffer: 100_000_000 })).stdout
        : source;

      let image = sharp(input, inputOptions).rotate();
      if (job.crop) image = image.extract(job.crop);
      await image.resize({ width: job.maxWidth ?? 1920, height: job.maxHeight ?? 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 }).toFile(destination);
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
