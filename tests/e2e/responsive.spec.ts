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

test('the flagship project grid has three columns on desktop and one on mobile', async ({ page }) => {
  const columnCount = () => page.locator('.project-grid').evaluate((grid) => (
    getComputedStyle(grid).gridTemplateColumns.split(' ').length
  ));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/');
  await expect.poll(columnCount).toBe(3);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(columnCount).toBe(1);
});
