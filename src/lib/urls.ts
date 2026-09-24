import { SITE } from '../config/site';

export function normalizePath(path: string): string {
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex < 0 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? '' : path.slice(suffixIndex);
  const clean = `/${pathname}`.replace(/\/+/g, '/').replace(/\/$/, '');
  const isFilePath = /\/[^/]+\.[^/]+$/.test(clean);
  return (clean === '' ? '/' : isFilePath ? clean : `${clean}/`) + suffix;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizePath(path), SITE.origin).toString();
}
