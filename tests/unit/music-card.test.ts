import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import MusicCard from '../../src/components/music/MusicCard.astro';

type MusicPlatform = CollectionEntry<'music'>['data']['platform'];

const platformCases: Array<{
  platform: MusicPlatform;
  url: string;
  label: string;
  embedHost?: string;
}> = [
  {
    platform: 'spotify',
    url: 'https://open.spotify.com/track/05lEafQvKSkcxqADBNBWKj',
    label: 'Spotify',
    embedHost: 'open.spotify.com',
  },
  {
    platform: 'soundcloud',
    url: 'https://soundcloud.com/artist/example',
    label: 'SoundCloud',
    embedHost: 'w.soundcloud.com',
  },
  {
    platform: 'bandcamp',
    url: 'https://artist.bandcamp.com/track/example',
    label: 'Bandcamp',
  },
  {
    platform: 'direct',
    url: 'https://example.com/audio/example.mp3',
    label: 'Direct link',
  },
];

function musicRecord(platform: MusicPlatform, url: string): CollectionEntry<'music'> {
  return {
    id: `${platform}-example`,
    collection: 'music',
    data: {
      title: `${platform} example`,
      platform,
      url,
      order: 1,
      featured: false,
      draft: false,
    },
  } as CollectionEntry<'music'>;
}

describe('MusicCard', () => {
  it.each(platformCases)('renders a safe outbound $platform card', async ({ platform, url, label }) => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(MusicCard, {
      props: { record: musicRecord(platform, url) },
    });

    expect(html).toContain(`href="${url}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(`Listen to ${platform} example on ${label}`);
    expect(html).not.toContain('<iframe');
  });

  it.each(platformCases)('offers a deferred player only when $platform has a validated embed', async ({
    platform,
    url,
    embedHost,
  }) => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(MusicCard, {
      props: { record: musicRecord(platform, url) },
    });

    if (embedHost) {
      expect(html).toContain('data-music-player-button');
      expect(html).toContain(embedHost);
      expect(html).not.toMatch(/autoplay/i);
    } else {
      expect(html).not.toContain('data-music-player-button');
      expect(html).not.toContain('data-music-player');
      expect(html).not.toContain('data-embed-url');
    }
  });

  it('renders a visible archive number when the grid supplies one', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(MusicCard, {
      props: { record: musicRecord('soundcloud', 'https://soundcloud.com/artist/example'), number: 7 },
    });

    expect(html).toContain('07');
    expect(html).toContain('data-music-number');
  });
});
