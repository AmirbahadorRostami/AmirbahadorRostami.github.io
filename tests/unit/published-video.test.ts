import { describe, expect, it } from 'vitest';
import { stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const root = resolve(import.meta.dirname, '../..');
const videos = [
  'experiments/01-cellular-automata.mp4',
  'experiments/01-cellular-automata-preview.mp4',
  'experiments/02-experiment.mp4',
  'experiments/03-experiment.mp4',
  'experiments/04-experiment.mp4',
  'experiments/05-experiment.mp4',
  'experiments/06-experiment.mp4',
  'experiments/07-experiment.mp4',
  'projects/encounters/pairing.mp4',
  'projects/encounters/wayfinding.mp4',
  'projects/luminous-trails/prototype.mp4',
  'projects/ephemeral-pulses-of-a-finite-scroll/installation.mp4',
  'projects/biowords/simulation.mp4',
  'projects/person-is-a-data-structure/trailer.mp4',
];

describe('published portfolio videos', () => {
  it.each(videos)('%s is present and small enough for static hosting', async (video) => {
    const file = resolve(root, 'public/media', video);
    const details = await stat(file);
    expect(details.size).toBeGreaterThan(10_000);
    expect(details.size).toBeLessThan(25_000_000);
  });

  it('publishes the BioWords simulation without an audio stream', async () => {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_type',
      '-of', 'csv=p=0', resolve(root, 'public/media/projects/biowords/simulation.mp4'),
    ]);
    expect(stdout.trim()).toBe('');
  });
});
