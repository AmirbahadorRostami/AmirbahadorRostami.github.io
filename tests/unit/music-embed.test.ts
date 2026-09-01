import { describe, expect, it } from 'vitest';
import { deriveMusicEmbedUrl, embedPermissionsFor } from '../../src/lib/music-embed';

describe('deriveMusicEmbedUrl', () => {
  it('derives the canonical Spotify track embed without autoplay parameters', () => {
    expect(deriveMusicEmbedUrl('spotify', 'https://open.spotify.com/track/05lEafQvKSkcxqADBNBWKj?si=abc')).toBe(
      'https://open.spotify.com/embed/track/05lEafQvKSkcxqADBNBWKj',
    );
  });

  it('derives a SoundCloud player URL from a valid public track URL', () => {
    expect(deriveMusicEmbedUrl('soundcloud', 'https://soundcloud.com/amir-bahador-rostami/lapaloma')).toBe(
      'https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Famir-bahador-rostami%2Flapaloma',
    );
  });

  it('rejects music records that cannot safely produce an embed', () => {
    expect(() => deriveMusicEmbedUrl('spotify', 'https://open.spotify.com/album/abc')).toThrow(
      'Unsupported Spotify track URL',
    );
    expect(() => deriveMusicEmbedUrl('direct', 'https://example.com/track.mp3')).toThrow(
      'Unsupported music platform "direct"',
    );
  });

  it('grants no autoplay capability to the deferred player facades', () => {
    expect(embedPermissionsFor('spotify')).toBe('encrypted-media');
    expect(embedPermissionsFor('soundcloud')).toBe('');
  });
});
