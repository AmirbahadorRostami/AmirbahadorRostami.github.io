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

  it('removes SoundCloud URL parameters so they cannot enable autoplay', () => {
    expect(deriveMusicEmbedUrl('soundcloud', 'https://soundcloud.com/artist/song?auto_play=true#comments')).toBe(
      'https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fartist%2Fsong',
    );
  });

  it('returns no embed for every outbound-only platform allowed by the music schema', () => {
    expect(deriveMusicEmbedUrl('bandcamp', 'https://artist.bandcamp.com/track/example')).toBeUndefined();
    expect(deriveMusicEmbedUrl('direct', 'https://example.com/track.mp3')).toBeUndefined();
  });

  it('degrades invalid Spotify and SoundCloud embed URLs to outbound-only playback', () => {
    expect(deriveMusicEmbedUrl('spotify', 'https://open.spotify.com/album/abc')).toBeUndefined();
    expect(deriveMusicEmbedUrl('soundcloud', 'https://example.com/track')).toBeUndefined();
    expect(deriveMusicEmbedUrl('soundcloud', 'http://soundcloud.com/artist/song')).toBeUndefined();
    expect(deriveMusicEmbedUrl('spotify', 'https://evil.example/track/05lEafQvKSkcxqADBNBWKj')).toBeUndefined();
  });

  it('grants no autoplay capability to the deferred player facades', () => {
    expect(embedPermissionsFor('spotify')).toBe('encrypted-media');
    expect(embedPermissionsFor('soundcloud')).toBe('');
    expect(embedPermissionsFor('bandcamp')).toBe('');
    expect(embedPermissionsFor('direct')).toBe('');
  });
});
