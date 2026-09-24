import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { productionRoutes } from '../helpers/production-routes';

const modules = readdirSync('dist/_astro').filter(name => name.endsWith('.js'));
// Shared chunks can have generic names; inspect their contents as well.
const rendererModules = modules.filter(name => /pixi|webgl|TenPrint|BioWords|controller|ten-print/i.test(name + readFileSync(`dist/_astro/${name}`, 'utf8')));

test('renderer modules are absent from unrelated HTML and network requests', async ({ page }) => {
  for (const route of productionRoutes.filter(route => route !== '/' && route !== '/work/biowords/')) {
    const requested: string[] = [];
    const listener = (request: import('@playwright/test').Request) => requested.push(new URL(request.url()).pathname);
    page.on('request', listener);
    await page.goto(route);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');
    const html = readFileSync(`dist${route}index.html`, 'utf8');
    for (const name of rendererModules) {
      expect(html, route).not.toContain(name);
      expect(requested, route).not.toContain(`/_astro/${name}`);
    }
    page.off('request', listener);
  }
});

test('optional renderer entry points stay isolated and within their compressed budget', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  const bio = readFileSync('dist/work/biowords/index.html', 'utf8');
  expect(home).toContain('TenPrintField.');
  expect(home).not.toContain('BioWordsExperience.');
  expect(bio).toContain('BioWordsExperience.');
  expect(bio).not.toContain('TenPrintField.');
  expect(rendererModules.length).toBeGreaterThan(0);
  const bytes = rendererModules.reduce((sum, name) => sum + gzipSync(readFileSync(`dist/_astro/${name}`)).length, 0);
  expect(bytes).toBeLessThan(300_000);
});
