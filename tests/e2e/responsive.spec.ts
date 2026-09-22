import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/work/',
  '/work/encounters/',
  '/work/luminous-trails/',
  '/work/ephemeral-pulses-of-a-finite-scroll/',
  '/work/biowords/',
  '/music/',
  '/about/',
  '/contact/',
];
const widths = [320, 390, 768, 1440];

for (const route of routes) {
  for (const width of widths) {
    test(`${route} does not overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test('homepage project and music grids have three columns on desktop and one on mobile', async ({ page }) => {
  const columnCount = (selector: string) => page.locator(selector).evaluate((grid) => (
    getComputedStyle(grid).gridTemplateColumns.split(' ').length
  ));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect.poll(() => columnCount('#selected-work .project-grid')).toBe(3);
  await expect.poll(() => columnCount('#selected-music [data-music-grid]')).toBe(3);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => columnCount('#selected-work .project-grid')).toBe(1);
  await expect.poll(() => columnCount('#selected-music [data-music-grid]')).toBe(1);
});

test('case-study content stays inside the 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/work/encounters/');

  const geometry = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
});
