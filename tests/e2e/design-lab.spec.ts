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

test('Poster Index keeps the desktop hero headline to two intentional lines', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/design-lab/poster-index/');

  await expect(page.locator('.poster-hero__headline-line')).toHaveCount(2);
  await expect(page.locator('.poster-hero__headline-line').evaluateAll(
    (lines) => new Set(lines.map((line) => line.getBoundingClientRect().top)).size,
  )).resolves.toBe(2);
});

test('Poster Index pauses its marquee only when the marquee itself is hovered', async ({ page }) => {
  await page.goto('/design-lab/poster-index/');
  const marquee = page.locator('[data-poster-marquee]');
  const track = marquee.locator('[data-lab-marquee]');

  await page.mouse.move(240, 240);
  const before = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.not.toBe(before);

  await marquee.hover();
  const paused = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(160);
  await expect(track.evaluate((element) => getComputedStyle(element).transform)).resolves.toBe(paused);
});

test('Type/Image Collision places the image between hero type layers', async ({ page }) => {
  await page.goto('/design-lab/type-image-collision/');

  const background = page.locator('[data-collision-type-layer="background"]');
  const image = page.locator('.collision-hero__image');
  const foreground = page.locator('[data-collision-type-layer="foreground"]');
  await expect(background).toHaveCount(1);
  await expect(foreground).toHaveCount(1);
  await expect(image).toHaveCount(1);
  const heroChildren = await page.locator('.collision-hero').evaluate((hero) => Array.from(hero.children).map(
    (child) => child.getAttribute('data-collision-type-layer') ?? child.className,
  ));
  expect(heroChildren.indexOf('background')).toBeLessThan(heroChildren.indexOf('collision-hero__image'));
  expect(heroChildren.indexOf('collision-hero__image')).toBeLessThan(heroChildren.indexOf('foreground'));
});

test('Type/Image Collision restores the complete shared identity and scrub targets', async ({ page }) => {
  await page.goto('/design-lab/type-image-collision/');

  await expect(page.getByText('Creative technologist. Musician. Professional maker of curious things.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-lab-scrub-reveal]')).toHaveCount(3);
});
