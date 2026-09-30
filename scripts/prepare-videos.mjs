import { execFile } from 'node:child_process';
import { access, mkdir, rename } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const run = promisify(execFile);
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceRoot = resolve(root, 'Media');
const videoRoot = resolve(root, 'public/media');
const posterRoot = resolve(root, 'src/assets');

export const VIDEO_JOBS = [
  { source: 'Media/experiments/CelluarAutomta.mov', video: 'public/media/experiments/01-cellular-automata.mp4', poster: 'src/assets/projects/cellular-automata/cellular-automata-poster.webp', posterAt: 40 },
  { source: 'Media/experiments/CelluarAutomta.mov', video: 'public/media/experiments/01-cellular-automata-preview.mp4', poster: 'src/assets/projects/cellular-automata/cellular-automata-preview-poster.webp', start: 35, duration: 15, posterAt: 40 },
  { source: 'Media/experiments/Choas_KKW_Edited.mp4', video: 'public/media/experiments/02-experiment.mp4', poster: 'src/assets/experiments/02-experiment-poster.webp', posterAt: 3 },
  { source: 'Media/experiments/Fire_KKW_Audio.mp4', video: 'public/media/experiments/03-experiment.mp4', poster: 'src/assets/experiments/03-experiment-poster.webp', posterAt: 12 },
  { source: 'Media/experiments/KKW_Choas_text_Audio - HD 1080p.mov', video: 'public/media/experiments/04-experiment.mp4', poster: 'src/assets/experiments/04-experiment-poster.webp', posterAt: 10 },
  { source: 'Media/experiments/ParticleSystem.mov', video: 'public/media/experiments/05-experiment.mp4', poster: 'src/assets/experiments/05-experiment-poster.webp', posterAt: 25 },
  { source: 'Media/experiments/ShoreLine_KKW_Audio.mp4', video: 'public/media/experiments/06-experiment.mp4', poster: 'src/assets/experiments/06-experiment-poster.webp', posterAt: 3 },
  { source: 'Media/experiments/Trees_KKW_Edited.mp4', video: 'public/media/experiments/07-experiment.mp4', poster: 'src/assets/experiments/07-experiment-poster.webp', posterAt: 4 },
  { source: 'Media/final/projects/encounters/pairing-video.mp4', video: 'public/media/projects/encounters/pairing.mp4', poster: 'src/assets/projects/encounters/pairing-poster.webp', posterAt: 8 },
  { source: 'Media/final/projects/encounters/wayfinding-social-gathering.mov', video: 'public/media/projects/encounters/wayfinding.mp4', poster: 'src/assets/projects/encounters/wayfinding-poster.webp', start: 35, duration: 35, posterAt: 50 },
  { source: 'Media/final/projects/luminous-trails/early-prototype-test.mov', video: 'public/media/projects/luminous-trails/prototype.mp4', poster: 'src/assets/projects/luminous-trails/prototype-poster.webp', start: 20, duration: 35, posterAt: 38 },
  { source: 'Media/final/projects/ephemeral-pulses-of-a-finite-scroll/InstallVidDoc.mp4', video: 'public/media/projects/ephemeral-pulses-of-a-finite-scroll/installation.mp4', poster: 'src/assets/projects/remote-realities/installation-poster.webp', start: 115, duration: 45, posterAt: 130 },
  { source: 'Media/final/projects/biowords/simulation-recording.mov', video: 'public/media/projects/biowords/simulation.mp4', poster: 'src/assets/projects/biowords/simulation-poster.webp', start: 15, duration: 45, posterAt: 35, mute: true },
  { source: 'Media/final/projects/person-is-a-data-structure/pids trailer.mp4', video: 'public/media/projects/person-is-a-data-structure/trailer.mp4', poster: 'src/assets/projects/person-is-a-data-structure/trailer-poster.webp', posterAt: 20 },
];

function inside(base, pathname) {
  const rest = relative(base, pathname);
  return rest !== '..' && !rest.startsWith(`..${sep}`) && !isAbsolute(rest);
}

export async function prepareVideos() {
  const outputs = new Set();
  for (const job of VIDEO_JOBS) {
    const source = resolve(root, job.source);
    const video = resolve(root, job.video);
    const poster = resolve(root, job.poster);
    if (!inside(sourceRoot, source) || !inside(videoRoot, video) || !inside(posterRoot, poster)) {
      throw new Error(`Video job escapes an approved media folder: ${job.source}`);
    }
    if (outputs.has(video) || outputs.has(poster)) throw new Error(`Duplicate video output: ${job.video}`);
    outputs.add(video);
    outputs.add(poster);
    await access(source);
    await mkdir(dirname(video), { recursive: true });
    await mkdir(dirname(poster), { recursive: true });

    const temporaryVideo = video.replace(/\.mp4$/, '.building.mp4');
    const segment = [
      ...(job.start === undefined ? [] : ['-ss', String(job.start)]),
      '-i', source,
      ...(job.duration === undefined ? [] : ['-t', String(job.duration)]),
    ];
    await run('ffmpeg', [
      '-loglevel', 'error', '-nostdin', '-y', ...segment,
      '-map', '0:v:0', ...(job.mute ? [] : ['-map', '0:a:0?']),
      '-vf', 'scale=1280:1280:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28',
      '-maxrate', '1400k', '-bufsize', '2800k', '-pix_fmt', 'yuv420p',
      ...(job.mute ? ['-an'] : ['-c:a', 'aac', '-b:a', '96k', '-ac', '2']),
      '-map_metadata', '-1', '-map_chapters', '-1', '-movflags', '+faststart', temporaryVideo,
    ], { maxBuffer: 4_000_000 });
    await rename(temporaryVideo, video);

    const { stdout } = await run('ffmpeg', [
      '-loglevel', 'error', '-ss', String(job.posterAt), '-i', source,
      '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-',
    ], { encoding: 'buffer', maxBuffer: 60_000_000 });
    await sharp(stdout).rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(poster);
    console.log(`${job.source} -> ${job.video} + ${job.poster}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prepareVideos().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
