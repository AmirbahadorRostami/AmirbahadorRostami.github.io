import { SITE } from '../config/site';

export function normalizePath(path: string): string {
  const clean = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  return clean === '' ? '/' : `${clean}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizePath(path), SITE.origin).toString();
}
