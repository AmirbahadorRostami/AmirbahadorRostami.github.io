import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import ProjectMedia from '../../src/components/projects/ProjectMedia.astro';
import { parseYouTubeUrl } from '../../src/lib/project-media';
import hero from '../../src/assets/projects/encounters/encounters-card.webp';

type Media = CollectionEntry<'projects'>['data']['media'];

function projectWithMedia(media: Media): CollectionEntry<'projects'> {
  return {
    id: 'media-test', collection: 'projects',
    data: {
      title: 'Media test', summary: 'A project used to verify media rendering.',
      cardSummary: 'A media rendering fixture.', depth: 'short', order: 1,
      featured: false, categories: ['test'], roles: ['Tester'], tools: ['Vitest'],
      hero, heroAlt: 'Test hero', collaborators: [], credits: [], externalLinks: [],
      media, liveExperiment: false, outcomes: [], draft: false,
    },
  } as CollectionEntry<'projects'>;
}

const placeholder: Media[number] = {
  id: 'system-architecture', type: 'diagram', intention: 'System architecture',
  aspectRatio: '16 / 9', alt: 'Diagram of the project architecture',
  caption: 'Architecture diagram planned for the final media pass.',
  state: 'placeholder', sources: [],
};

describe('parseYouTubeUrl', () => {
  it.each([
    'https://www.youtube.com/embed/eJJue_cGV3E',
    'https://youtube.com/watch?v=eJJue_cGV3E',
    'https://www.youtube-nocookie.com/embed/eJJue_cGV3E',
    'https://youtu.be/eJJue_cGV3E?t=12',
  ])('accepts a supported HTTPS YouTube URL: %s', (url) => {
    expect(parseYouTubeUrl(url)).toEqual({ videoId: 'eJJue_cGV3E' });
  });

  it.each([
    'https://vimeo.com/123', 'javascript:alert(1)', 'not a url',
    'http://www.youtube.com/embed/eJJue_cGV3E',
    'https://www.youtube.com.evil.test/embed/eJJue_cGV3E',
    'https://youtube.com/unsupported?v=eJJue_cGV3E',
    'https://youtube.com/embed/not-an-id',
    'https://youtu.be/eJJue_cGV3E/extra',
    'https://youtube.com/watch',
    'https://user:password@youtube.com/watch?v=eJJue_cGV3E',
    'https://youtube.com:444/watch?v=eJJue_cGV3E',
  ])('rejects unsupported or malformed embed URLs: %s', (url) => {
    expect(parseYouTubeUrl(url)).toBeUndefined();
  });
});

describe('ProjectMedia', () => {
  it('renders all documentary requirements for a placeholder without an image', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectMedia, { props: { project: projectWithMedia([placeholder]) } });
    for (const value of ['data-media-state="placeholder"', 'Media test', 'System architecture',
      'diagram', '16 / 9', 'Diagram of the project architecture', placeholder.caption, 'Placeholder']) {
      expect(html).toContain(value);
    }
    expect(html).toContain('aspect-ratio: 16 / 9');
    expect(html).not.toContain('<img');
  });

  it('renders ready imagery from the record regardless of the project slug', async () => {
    const project = projectWithMedia([{ ...placeholder, type: 'image', state: 'ready', image: hero }]);
    project.id = 'luminous-trails';
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectMedia, { props: { project } });
    expect(html.match(/<img\b/g)).toHaveLength(1);
    expect(html).toContain('alt="Diagram of the project architecture"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain(placeholder.caption);
  });

  it('keeps an unsupported HTTPS video as a safe outbound-only link', async () => {
    const url = 'https://vimeo.com/123456789';
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectMedia, {
      props: { project: projectWithMedia([{ ...placeholder, type: 'video', state: 'ready', externalUrl: url }]) },
    });
    expect(html).toContain(`href="${url}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('data-video-facade');
    expect(html).not.toContain('<iframe');
  });

  it('renders a local video with its poster and sources without autoplay or preloading', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectMedia, {
      props: { project: projectWithMedia([{
        ...placeholder, type: 'video', state: 'ready', poster: hero,
        sources: [{ src: '/media/test.webm', type: 'video/webm' }, { src: '/media/test.mp4', type: 'video/mp4' }],
      }]) },
    });
    expect(html).toMatch(/<video[^>]*controls/);
    expect(html).toContain('preload="none"');
    expect(html).toContain('poster="');
    expect(html).toContain('src="/media/test.webm" type="video/webm"');
    expect(html).toContain('src="/media/test.mp4" type="video/mp4"');
    expect(html).not.toContain('autoplay');
  });

  it('leaves YouTube unloaded while keeping a usable static outbound link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectMedia, {
      props: { project: projectWithMedia([{
        ...placeholder, type: 'video', state: 'ready', externalUrl: 'https://youtu.be/eJJue_cGV3E',
      }]) },
    });
    expect(html).toContain('data-video-id="eJJue_cGV3E"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('href="https://www.youtube.com/watch?v=eJJue_cGV3E"');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('ytimg.com');
  });
});
