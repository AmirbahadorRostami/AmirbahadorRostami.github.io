import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const auditedRoutes = [
  '/',
  '/work/',
  '/work/encounters/',
  '/work/luminous-trails/',
  '/work/remote-realities/',
  '/work/biowords/',
  '/music/',
  '/about/',
  '/contact/',
];

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
