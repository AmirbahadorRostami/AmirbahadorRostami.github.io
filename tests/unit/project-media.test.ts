import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import ProjectMedia from '../../src/components/projects/ProjectMedia.astro';

function projectWithVideo(url: string): CollectionEntry<'projects'> {
  return {
    id: 'video-fallback',
    collection: 'projects',
    data: {
      title: 'Video fallback',
      summary: 'A test project with an externally hosted video.',
      cardSummary: 'A video fallback test.',
      depth: 'short',
      order: 1,
      featured: false,
      categories: ['test'],
      roles: ['Test'],
      tools: ['Test'],
      hero: {} as ImageMetadata,
      heroAlt: 'Test image',
      collaborators: [],
      credits: [],
      externalLinks: [],
      media: [{
        id: 'external-project-film',
        type: 'video',
        intention: 'External project film',
        aspectRatio: '16 / 9',
        alt: 'External project film',
        caption: 'External project film',
        state: 'ready',
        sources: [],
        externalUrl: url,
      }],
      liveExperiment: false,
      outcomes: [],
      draft: false,
    },
  } as CollectionEntry<'projects'>;
}

describe('ProjectMedia', () => {
  it('keeps an unsupported HTTPS video as a safe outbound-only link', async () => {
    const url = 'https://vimeo.com/123456789';
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectMedia, {
      props: { project: projectWithVideo(url) },
    });

    expect(html).toContain(`href="${url}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('External project film');
    expect(html).not.toContain('data-video-facade');
    expect(html).not.toContain('<iframe');
  });
});
