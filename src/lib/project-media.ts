/** Recognize only the HTTPS YouTube routes that can become privacy-enhanced embeds. */
export function parseYouTubeUrl(raw: string): { videoId: string } | undefined {
  let url: URL;
  try { url = new URL(raw); } catch { return undefined; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return undefined;

  const host = url.hostname.toLowerCase();
  const youtube = /^(?:www\.)?youtube(?:-nocookie)?\.com$/.test(host);
  if (!youtube && host !== 'youtu.be') return undefined;

  const videoId = host === 'youtu.be'
    ? url.pathname.match(/^\/([\w-]{11})\/?$/)?.[1]
    : /^\/watch\/?$/.test(url.pathname)
      ? url.searchParams.get('v')
      : url.pathname.match(/^\/embed\/([\w-]{11})\/?$/)?.[1];

  return videoId && /^[\w-]{11}$/.test(videoId) ? { videoId } : undefined;
}
