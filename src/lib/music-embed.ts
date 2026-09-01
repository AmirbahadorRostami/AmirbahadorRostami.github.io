const SPOTIFY_TRACK_HOSTS = new Set(['open.spotify.com', 'www.open.spotify.com']);
const SOUNDCLOUD_HOSTS = new Set(['soundcloud.com', 'www.soundcloud.com']);

function invalidUrl(platform: string): never {
  throw new Error(`Unsupported ${platform} track URL. Use a public HTTPS ${platform} track URL.`);
}

export function deriveMusicEmbedUrl(platform: string, rawUrl: string): string {
  if (platform !== 'spotify' && platform !== 'soundcloud') {
    throw new Error(`Unsupported music platform "${platform}". Music embeds support Spotify and SoundCloud only.`);
  }

  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    return invalidUrl(platform === 'spotify' ? 'Spotify' : 'SoundCloud');
  }

  if (url.protocol !== 'https:') {
    return invalidUrl(platform === 'spotify' ? 'Spotify' : 'SoundCloud');
  }

  if (platform === 'spotify') {
    const match = url.pathname.match(/^\/track\/([A-Za-z0-9]{22})\/?$/);

    if (!SPOTIFY_TRACK_HOSTS.has(url.hostname.toLowerCase()) || !match) {
      return invalidUrl('Spotify');
    }

    return `https://open.spotify.com/embed/track/${match[1]}`;
  }

  const pathSegments = url.pathname.split('/').filter(Boolean);

  if (!SOUNDCLOUD_HOSTS.has(url.hostname.toLowerCase()) || pathSegments.length < 2) {
    return invalidUrl('SoundCloud');
  }

  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.toString())}`;
}

export function embedPermissionsFor(platform: string): string {
  return platform === 'spotify' ? 'encrypted-media' : '';
}
