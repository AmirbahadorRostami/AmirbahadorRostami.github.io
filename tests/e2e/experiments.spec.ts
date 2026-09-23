import { expect, test } from '@playwright/test';

test('renders exactly seven experiments without invented metadata', async ({ page }) => {
  await page.goto('/experiments/');
  const cards = page.locator('[data-experiment-card]');
  await expect(cards).toHaveCount(7);
  await expect(cards.locator('h2')).toHaveText([
    'Cellular Automata', 'Experiment 02', 'Experiment 03', 'Experiment 04',
    'Experiment 05', 'Experiment 06', 'Experiment 07',
  ]);
  await expect(page.locator('[data-experiment-card][data-experiment-state="placeholder"]')).toHaveCount(6);
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

test('pending frames show only neutral labels and keep a readable ratio', async ({ page }) => {
  await page.goto('/experiments/');
  const pending = page.locator('[data-experiment-state="placeholder"]');
  await expect(pending).toHaveCount(6);
  await expect(pending.locator('[data-experiment-sequence]')).toHaveText(['02', '03', '04', '05', '06', '07']);
  for (const card of await pending.all()) {
    await expect(card).toContainText('Video study');
    await expect(card).toContainText('16 / 9');
    await expect(card).toContainText('Media pending');
    await expect(card.locator('video, img, [data-experiment-description], [data-experiment-year], [data-experiment-technique], [data-experiment-tools]')).toHaveCount(0);
  }
});

test('reduced motion keeps the poster visible and never starts playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/experiments/');
  await expect(page.locator('#cellular-automata img')).toBeVisible();
  await expect(page.locator('video[autoplay]')).toHaveCount(0);
  expect(await page.locator('video').evaluateAll((videos) => videos.every((video) => (video as HTMLVideoElement).paused))).toBe(true);
});
