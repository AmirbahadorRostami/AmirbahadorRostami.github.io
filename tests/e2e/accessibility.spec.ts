import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const auditedRoutes = [
  '/',
  '/work/',
  '/work/encounters/',
  '/work/luminous-trails/',
  '/work/ephemeral-pulses-of-a-finite-scroll/',
  '/work/biowords/',
  '/experiments/',
  '/music/',
  '/about/',
  '/contact/',
];

test('reduced motion exposes reveal content immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('h1').evaluate((heading) => {
    heading.classList.add('reveal');
    heading.style.opacity = '0';
    heading.style.transform = 'translateY(24px)';
    heading.style.visibility = 'hidden';
    heading.style.transition = 'opacity 1s';
  });
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toHaveCSS('transform', 'none');
  await expect(heading).toHaveCSS('transition-property', 'none');
});

for (const route of auditedRoutes) {
  test(`${route} has no serious or critical Axe violations`, async ({ page }) => {
    await page.goto(route);

    const results = await new AxeBuilder({ page }).analyze();
    const blockingViolations = results.violations.filter(
      ({ impact }) => impact === 'critical' || impact === 'serious',
    );

    expect(blockingViolations, JSON.stringify(blockingViolations, null, 2)).toEqual([]);
  });
}
