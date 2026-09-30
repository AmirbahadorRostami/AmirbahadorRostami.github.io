import { expect, test } from '@playwright/test';

test('renders seven studies with only two public titles and no card indices', async ({ page }) => {
  await page.goto('/experiments/');
  const cards = page.locator('[data-experiment-card]');
  await expect(cards).toHaveCount(7);
  await expect(cards.locator('h2:visible')).toHaveText(['Cellular Automata', 'Agent Trails']);
  await expect(cards.nth(1).locator('h2')).toHaveText('Agent Trails');
  await expect(cards.locator('[data-experiment-sequence]')).toHaveCount(0);
  await expect(page.getByText(/Experiment 0[2-7]/)).toHaveCount(0);
  await expect(page.locator('[data-experiment-card][data-experiment-state="ready"]')).toHaveCount(7);
  await expect(page.locator('video[autoplay]')).toHaveCount(0);
});

test('uses the approved introduction and preserves the Cellular Automata redirect target', async ({ page }) => {
  await page.goto('/experiments/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Small systems making big, strange pictures.');
  await expect(page.locator('#cellular-automata')).toHaveCount(1);
  await expect(page.locator('#cellular-automata img')).toHaveCount(1);
  await expect(page.locator('#cellular-automata').getByRole('link', { name: /source/i })).toHaveAttribute(
    'href', 'https://codepen.io/amirbahadorrostami/pen/GRMQewe',
  );
});

test('Agent Trails explains its invisible agents and links to the video and source', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/experiments/');
  const card = page.locator('[data-experiment-card]').nth(1);
  await expect(card.getByRole('heading', { name: 'Agent Trails' })).toBeVisible();
  await expect(card.locator('[data-experiment-description]')).toContainText('trails');
  await expect(card.locator('[data-experiment-description]')).toContainText('agents');
  const videoLink = card.getByRole('link', { name: 'Open video' });
  const sourceLink = card.getByRole('link', { name: 'View source ↗' });
  await expect(sourceLink).toHaveAttribute(
    'href', 'https://codepen.io/amirbahadorrostami/pen/aXqebP',
  );
  await expect(sourceLink).toHaveAttribute('target', '_blank');
  const videoBox = await videoLink.boundingBox();
  const liveBox = await sourceLink.boundingBox();
  expect(videoBox).not.toBeNull();
  expect(liveBox).not.toBeNull();
  if (videoBox && liveBox && Math.abs(videoBox.y - liveBox.y) < 2) {
    expect(liveBox.x - (videoBox.x + videoBox.width)).toBeGreaterThanOrEqual(16);
  }
});

test('Cellular Automata uses the short video action label', async ({ page }) => {
  await page.goto('/experiments/');
  await expect(page.locator('#cellular-automata').getByRole('link', { name: 'Open video' })).toBeVisible();
});

test('all seven supplied studies have playable local video and a poster without invented metadata', async ({ page }) => {
  await page.goto('/experiments/');
  const cards = page.locator('[data-experiment-card]');
  await expect(cards.locator('[data-experiment-sequence]')).toHaveCount(0);
  for (const card of await cards.all()) {
    await expect(card.locator('img')).toHaveCount(1);
    await expect(card.locator('video[controls][preload="none"] source[type="video/mp4"]')).toHaveCount(1);
    const src = await card.locator('source').getAttribute('src');
    expect(src).toMatch(/^\/media\/experiments\/.+\.mp4$/);
    const response = await page.request.get(src!, { headers: { Range: 'bytes=0-1023' } });
    expect(response.ok()).toBe(true);
    expect((await response.body()).length).toBeGreaterThan(0);
    await expect(card.locator('[data-experiment-year], [data-experiment-technique], [data-experiment-tools]')).toHaveCount(0);
  }
});

test('reduced motion keeps the poster visible and never starts playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/experiments/');
  await expect(page.locator('#cellular-automata img')).toBeVisible();
  await expect(page.locator('video[autoplay]')).toHaveCount(0);
  expect(await page.locator('video').evaluateAll((videos) => videos.every((video) => (video as HTMLVideoElement).paused))).toBe(true);
});
