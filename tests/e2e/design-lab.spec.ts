import { expect, test } from '@playwright/test';

const slugs = [
  'poster-index',
  'type-image-collision',
  'darkroom-cinema',
  'printed-signal-lab',
  'coral-broadcast',
  'clau-poster-wall',
];

test('design lab exposes a six-concept comparison hub', async ({ page }) => {
  await page.goto('/design-lab/');
  await expect(page.getByRole('heading', { level: 1, name: 'Six ways this portfolio could feel.' })).toBeVisible();
  await expect(page.locator('[data-concept-link]')).toHaveCount(6);
});

test('utility labels use the active bundled page family', async ({ page }) => {
  await page.goto('/design-lab/');
  for (const selector of ['.lab-label', '.concept-number', '.concept-font']) {
    await expect(page.locator(selector).first()).toHaveCSS('font-family', '"Outfit Variable", sans-serif');
  }

  await page.goto('/design-lab/poster-index/');
  await expect(page.locator('.shell-label')).toHaveCSS('font-family', '"Space Grotesk Variable", sans-serif');
});

for (const slug of slugs) {
  test(`${slug} is statically reachable and noindexed`, async ({ page }) => {
    await page.goto(`/design-lab/${slug}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.getByRole('link', { name: 'Back to all concepts' })).toBeVisible();
  });
}

for (const [slug, title] of [
  ['poster-index', 'Poster Index'],
  ['type-image-collision', 'Type/Image Collision'],
] as const) {
  test(`${title} keeps its portfolio content visible without horizontal overflow`, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/design-lab/${slug}/`);

      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('[data-lab-project]')).toHaveCount(3);
      await expect(page.locator('[data-lab-track]')).toHaveCount(3);
      await expect(page.locator('a[href="/contact/"]')).toBeVisible();
      await expect.poll(() => page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      )).toBe(true);
    }
  });
}
