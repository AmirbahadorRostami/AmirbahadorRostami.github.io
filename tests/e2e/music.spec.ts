import { expect, test } from '@playwright/test';

const trackTitles = [
  'La Paloma',
  'Float',
  'Flow',
  'Idk',
  'Googoosh - Lalai (Bahador Remake)',
  'Try',
  'Into the Daylight',
];

test('music page renders the approved seven-track featured-first catalog', async ({ page }) => {
  await page.goto('/music/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Things I make with sound.');
  await expect(page.locator('[data-music-card]')).toHaveCount(7);
  await expect(page.locator('[data-music-card] h3')).toHaveText(trackTitles);
  await expect(page.locator('[data-music-group="featured"] [data-music-card] h3')).toHaveText([
    'La Paloma',
    'Float',
    'Flow',
  ]);
  await expect(page.locator('[data-music-group="catalog"] [data-music-card] h3')).toHaveText([
    'Idk',
    'Googoosh - Lalai (Bahador Remake)',
    'Try',
    'Into the Daylight',
  ]);
});

test('music page does not request or include third-party players before a listener asks for one', async ({ page }) => {
  const thirdPartyRequests: string[] = [];
  page.on('request', (request) => {
    if (/spotify\.com|soundcloud\.com/i.test(request.url())) thirdPartyRequests.push(request.url());
  });

  await page.goto('/music/');

  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('[autoplay]')).toHaveCount(0);
  expect(thirdPartyRequests).toEqual([]);
});

test('loading a SoundCloud player activates only the selected card and keeps its outbound fallback', async ({ page }) => {
  await page.goto('/music/');

  const card = page.locator('[data-music-card]', { hasText: 'La Paloma' });
  await card.getByRole('button', { name: 'Load player for La Paloma' }).click();

  await expect(card.locator('iframe')).toHaveCount(1);
  await expect(card.locator('iframe')).not.toHaveAttribute('autoplay', /.+/);
  await expect(card.getByRole('link', { name: 'Listen to La Paloma on SoundCloud' })).toHaveAttribute(
    'href',
    'https://soundcloud.com/amir-bahador-rostami/lapaloma',
  );
  await expect(page.locator('[data-music-card] iframe')).toHaveCount(1);
});

test('loading a Spotify player activates only the selected card and keeps its outbound fallback', async ({ page }) => {
  await page.goto('/music/');

  const card = page.locator('[data-music-card]', { hasText: 'Try' });
  await card.getByRole('button', { name: 'Load player for Try' }).click();

  await expect(card.locator('iframe')).toHaveCount(1);
  await expect(card.locator('iframe')).not.toHaveAttribute('autoplay', /.+/);
  await expect(card.getByRole('link', { name: 'Listen to Try on Spotify' })).toHaveAttribute(
    'href',
    'https://open.spotify.com/track/05lEafQvKSkcxqADBNBWKj',
  );
  await expect(page.locator('[data-music-card] iframe')).toHaveCount(1);
});

test('music platform profile links only render for configured profiles', async ({ page }) => {
  await page.goto('/music/');

  await expect(page.getByRole('link', { name: 'SoundCloud profile' })).toHaveAttribute(
    'href',
    'https://soundcloud.com/amir-bahador-rostami',
  );
  await expect(page.getByRole('link', { name: 'Spotify profile' })).toHaveCount(0);
});

test('music catalog uses responsive grids with no horizontal overflow', async ({ page }) => {
  const measure = async () => page.locator('[data-music-grid]').evaluateAll((elements) => elements.map((element) => ({
    columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
    display: getComputedStyle(element).display,
    overflows: element.scrollWidth > element.clientWidth,
  })));

  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto('/music/');
  expect(await measure()).toEqual([
    { columns: 3, display: 'grid', overflows: false },
    { columns: 3, display: 'grid', overflows: false },
  ]);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await measure()).toEqual([
    { columns: 1, display: 'grid', overflows: false },
    { columns: 1, display: 'grid', overflows: false },
  ]);
});
