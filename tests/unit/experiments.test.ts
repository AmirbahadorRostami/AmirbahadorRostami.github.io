import { describe, expect, it } from 'vitest';
import { experimentAnchor, hasPlayableSources } from '../../src/lib/experiments';

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
