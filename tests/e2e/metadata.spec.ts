import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { productionRoutes } from '../helpers/production-routes';

const origin = 'https://amirbahadorrostami.github.io';

test('all canonical production routes have distinct descriptions and matching social metadata', async ({ page }) => {
  const descriptions = new Set<string>();
  const titles = new Set<string>();
  for (const route of productionRoutes) {
    await page.goto(route);
    const title = (await page.title()).trim();
    expect(title, route).toMatch(/\S+/);
    expect(titles.has(title), route).toBe(false);
    titles.add(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${route}`);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toMatch(/\S+/);
    expect(descriptions.has(description!)).toBe(false);
    descriptions.add(description!);
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      await expect(page.locator(selector)).toHaveAttribute('content', description!);
    }
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', await page.title());
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
  }
});

test('sitemap lists exactly the canonical production routes', () => {
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).sort();
  expect(urls).toEqual(productionRoutes.map(route => `${origin}${route}`).sort());
});

test('compatibility redirects publish target canonicals and noindex', async ({ request }) => {
  for (const [source, target] of [['remote-realities', '/work/ephemeral-pulses-of-a-finite-scroll/'], ['cellular-automata', '/experiments/#cellular-automata']]) {
    const html = await (await request.get(`/work/${source}/`)).text();
    expect(html).toContain(`rel="canonical" href="${origin}${target}"`);
    expect(html).toContain('name="robots" content="noindex, follow"');
  }
});

const routes = [
  { path: '/', canonical: `${origin}/`, title: 'Amir Bahador Rostami — Creative Technologist & Musician' },
  { path: '/music/', canonical: `${origin}/music/`, title: 'Music by Baha | Amir Bahador Rostami' },
  { path: '/404.html', canonical: `${origin}/404.html`, title: 'Page not found | Amir Rostami' },
];

test('production routes default to index, follow', async ({ page }) => {
  for (const route of ['/', '/work/', '/music/', '/about/', '/contact/']) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]'), route).toHaveAttribute('content', 'index, follow');
  }
});

test('design lab routes remain noindexed, visually isolated and unlinked', async ({ page }) => {
  const labRoutes = [
    '/design-lab/',
    '/design-lab/poster-index/',
    '/design-lab/type-image-collision/',
    '/design-lab/darkroom-cinema/',
    '/design-lab/printed-signal-lab/',
    '/design-lab/coral-broadcast/',
    '/design-lab/clau-poster-wall/',
  ];
  for (const route of labRoutes) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]'), route).toHaveAttribute('content', 'noindex, nofollow');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--signal').trim())).toBe('');
    await expect(page.locator('.site-header, .site-footer')).toHaveCount(0);
  }
  await page.goto('/');
  await expect(page.locator('a[href^="/design-lab/"]')).toHaveCount(0);
});

for (const route of routes) {
  test(`${route.path} publishes complete, absolute social metadata`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', route.canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', route.canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${origin}/og.png`);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${origin}/og.png`);
  });
}

test('Encounters publishes its record-specific social preview instead of the site default', async ({ page }) => {
  await page.goto('/work/encounters/');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${origin}/work/encounters/`,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'An augmented-reality social experience that guides Congress participants through public space toward shared virtual bodies of water.',
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Encounters | Amir Bahador Rostami',
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    'An augmented-reality social experience that guides Congress participants through public space toward shared virtual bodies of water.',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    new RegExp(`^${origin.replace('.', '\\.')}/_astro/.*encounters-card`),
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    'content',
    'Encounters | Amir Bahador Rostami',
  );
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
    'content',
    'An augmented-reality social experience that guides Congress participants through public space toward shared virtual bodies of water.',
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    new RegExp(`^${origin.replace('.', '\\.')}/_astro/.*encounters-card`),
  );
});

test('404 gives visitors a clear recovery path without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/404.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');

  await expect(page.getByRole('heading', { level: 1, name: 'That signal went somewhere else.' })).toBeVisible();
  const recovery = page.getByRole('navigation', { name: 'Portfolio sections' });
  await expect(recovery.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work/');
  await expect(recovery.getByRole('link', { name: 'Music' })).toHaveAttribute('href', '/music/');
  await expect(recovery.getByRole('link', { name: 'Experiments' })).toHaveAttribute('href', '/experiments/');
  await expect(recovery.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact/');
  await context.close();
});
