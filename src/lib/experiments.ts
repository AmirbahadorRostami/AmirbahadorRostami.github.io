export const experimentAnchor = (title: string): string => title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/\p{M}/gu, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const hasPlayableSources = (sources: { src: string; type: string }[]): boolean =>
  sources.some(({ src, type }) => /^\/[^/\\]/.test(src) && /^video\/(mp4|webm)$/.test(type));
