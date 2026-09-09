import { SITE } from '../config/site';

export function normalizePath(path: string): string {
  const clean = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  const isFilePath = /\/[^/]+\.[^/]+$/.test(clean);
  return clean === '' ? '/' : isFilePath ? clean : `${clean}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizePath(path), SITE.origin).toString();
}
