import { expect, test } from '@playwright/test';

const trackTitles = [
  'La Paloma',
  'Float',
  'Flow',
  'Idk',
  'Googoosh - Lalai (Bahador Remake)',
  'Try',
  'Into the Daylight',
  'COMOTION',
];

test('presents all eight releases as Music by Baha', async ({ page }) => {
  await page.goto('/music/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Music by Baha');
  await expect(page.locator('.music-archive__intro')).toHaveText(
    'Baha is the musical project of Amir Bahador Rostami—a place where electronic and acoustic instruments drift into the same orbit, forming spacey textures, vibrant colours, and sweet harmonies across big landscapes.',
  );
  await expect(page.locator('[data-music-card]')).toHaveCount(8);
  await expect(page.locator('[data-music-number]')).toHaveText(['01', '02', '03', '04', '05', '06', '07', '08']);
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('[data-music-card] h2')).toHaveText(trackTitles);
  await expect(page.getByRole('heading', { name: 'All music' })).toHaveCount(0);
  const releases = page.getByRole('list', { name: 'Music releases' });
  await expect(releases).toHaveCount(1);
  await expect(releases.getByRole('listitem')).toHaveCount(8);
});

test('music page uses outbound listening links without any private players', async ({ page }) => {
  const thirdPartyRequests: string[] = [];
  page.on('request', (request) => {
    if (/spotify\.com|soundcloud\.com/i.test(request.url())) thirdPartyRequests.push(request.url());
  });

  await page.goto('/music/');

  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('[data-music-player-button]')).toHaveCount(0);
  await expect(page.locator('[data-music-player]')).toHaveCount(0);
  await expect(page.locator('[autoplay]')).toHaveCount(0);
  expect(thirdPartyRequests).toEqual([]);
});

test('SoundCloud cards keep their outbound listening links', async ({ page }) => {
  await page.goto('/music/');

  const card = page.locator('[data-music-card]', { hasText: 'La Paloma' });
  await expect(card.getByRole('link', { name: 'Listen to La Paloma on SoundCloud' })).toHaveAttribute(
    'href',
    'https://soundcloud.com/amir-bahador-rostami/lapaloma',
  );
});

test('Spotify cards keep their outbound listening links', async ({ page }) => {
  await page.goto('/music/');

  const card = page.locator('[data-music-card]', { hasText: 'Try' });
  await expect(card.getByRole('link', { name: 'Listen to Try on Spotify' })).toHaveAttribute(
    'href',
    'https://open.spotify.com/track/05lEafQvKSkcxqADBNBWKj',
  );
  const comotion = page.locator('[data-music-card]', { hasText: 'COMOTION' });
  await expect(comotion.getByRole('link', { name: 'Listen to COMOTION on Spotify' })).toHaveAttribute(
    'href',
    'https://open.spotify.com/track/72365foUA21VtYXNg9Sdvc',
  );
});

test('music platform profile links only render for configured profiles', async ({ page }) => {
  await page.goto('/music/');

  await expect(page.getByRole('link', { name: 'SoundCloud profile' })).toHaveAttribute(
    'href',
    'https://soundcloud.com/amir-bahador-rostami',
  );
  await expect(page.getByRole('link', { name: 'Spotify profile' })).toHaveAttribute(
    'href',
    'https://open.spotify.com/artist/6854BmgZPcYRCZ6ZUluBuo',
  );
  await expect(page.getByRole('link', { name: 'Apple Music profile' })).toHaveCount(0);
  await expect(page.locator('.music-archive__profiles a')).toHaveText(['SoundCloud', 'Spotify']);
});

test('music archive has compact full-width rows at desktop and mobile sizes', async ({ page }) => {
  await page.goto('/music/');
  const releases = page.getByRole('list', { name: 'Music releases' });
  await expect(releases).toBeVisible();

  for (const width of [1100, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const list = await releases.boundingBox();
    const rows = await releases.getByRole('listitem').evaluateAll((items) => items.map((item) => {
      const { x, y, width, height } = item.getBoundingClientRect();
      return { x, y, width, height, overflows: item.scrollWidth > item.clientWidth };
    }));
    expect(list).not.toBeNull();
    expect(rows).toHaveLength(8);
    rows.forEach((row, index) => {
      expect(Math.abs(row.width - list!.width)).toBeLessThan(3);
      expect(row.height).toBeLessThan(width >= 768 ? 180 : 230);
      expect(row.overflows).toBe(false);
      if (index > 0) expect(row.y).toBeGreaterThanOrEqual(rows[index - 1].y + rows[index - 1].height - 1);
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
