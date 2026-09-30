import { describe, expect, it } from 'vitest';
import { experimentAnchor, hasPlayableSources } from '../../src/lib/experiments';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ExperimentCard from '../../src/components/experiments/ExperimentCard.astro';

it('keeps a local video fallback visible outside the experiment player', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ExperimentCard, { props: { experiment: {
    data: { title: 'Synthetic study', order: 1, state: 'ready', tools: [], sources: [
      { src: '/media/synthetic.webm', type: 'video/webm' },
      { src: '//unsafe.test/video.mp4', type: 'video/mp4' },
    ] },
  } } });
  const outsideVideo = html.replace(/<video\b[\s\S]*?<\/video>/g, '');
  expect(outsideVideo).toContain('href="/media/synthetic.webm"');
  expect(outsideVideo).toContain('>Open video</a>');
  expect(html).not.toContain('unsafe.test');
});

it('keeps unnamed video cards visually title-free but identifiable to assistive technology', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ExperimentCard, { props: { experiment: {
    id: '02-experiment-02',
    data: { order: 3, state: 'ready', tools: [], sources: [
      { src: '/media/untitled.mp4', type: 'video/mp4' },
    ] },
  } } });

  expect(html).toContain('Untitled video study 3 of 7');
  expect(html).toContain('Open video');
  expect(html).not.toContain('data-experiment-sequence');
  expect(html).not.toContain('Experiment 02');
});

describe('experiment archive helpers', () => {
  it('creates stable lower-case anchors', () => {
    expect(experimentAnchor('Cellular Automata')).toBe('cellular-automata');
    expect(experimentAnchor('Experiment 02')).toBe('experiment-02');
    expect(experimentAnchor('Écho / Forms')).toBe('echo-forms');
  });

  it('selects only local playable video sources', () => {
    expect(hasPlayableSources([])).toBe(false);
    expect(hasPlayableSources([{ src: 'https://example.com/video.mp4', type: 'video/mp4' }])).toBe(false);
    expect(hasPlayableSources([{ src: '//example.com/video.mp4', type: 'video/mp4' }])).toBe(false);
    expect(hasPlayableSources([{ src: '/\\example.com/video.mp4', type: 'video/mp4' }])).toBe(false);
    expect(hasPlayableSources([{ src: '/media/video.mov', type: 'video/quicktime' }])).toBe(false);
    expect(hasPlayableSources([{ src: '/media/video.webm', type: 'video/webm' }])).toBe(true);
  });
});
