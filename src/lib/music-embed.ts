const SPOTIFY_TRACK_HOSTS = new Set(['open.spotify.com', 'www.open.spotify.com']);
const SOUNDCLOUD_HOSTS = new Set(['soundcloud.com', 'www.soundcloud.com']);

export function deriveMusicEmbedUrl(platform: string, rawUrl: string): string | undefined {
  if (platform !== 'spotify' && platform !== 'soundcloud') {
    return undefined;
  }

  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    return undefined;
  }

  if (url.protocol !== 'https:') {
    return undefined;
  }

  if (platform === 'spotify') {
    const match = url.pathname.match(/^\/track\/([A-Za-z0-9]{22})\/?$/);

    if (!SPOTIFY_TRACK_HOSTS.has(url.hostname.toLowerCase()) || !match) {
      return undefined;
    }

    return `https://open.spotify.com/embed/track/${match[1]}`;
  }

  const pathSegments = url.pathname.split('/').filter(Boolean);

  if (!SOUNDCLOUD_HOSTS.has(url.hostname.toLowerCase()) || pathSegments.length < 2) {
    return undefined;
  }

  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.toString())}`;
}

export function embedPermissionsFor(platform: string): string {
  return platform === 'spotify' ? 'encrypted-media' : '';
}
