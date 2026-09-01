import { expect, test } from '@playwright/test';

const projectTitles = [
  'Encounters',
  'Luminous Trails',
  'Remote Realities',
  'BioWords',
  'Person Is a Data Structure',
  'Cellular Automata',
];

test('lists every published project and filters cards with synchronized pressed states', async ({ page }) => {
  await page.goto('/work/');

  await expect(page.locator('[data-project-card]')).toHaveCount(6);
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(projectTitles);

  const allProjects = page.getByRole('button', { name: 'All projects' });
  const augmentedReality = page.getByRole('button', { name: 'Augmented reality' });

  await expect(allProjects).toHaveAttribute('aria-pressed', 'true');
  await expect(augmentedReality).toHaveAttribute('aria-pressed', 'false');

  await augmentedReality.click();

  await expect(allProjects).toHaveAttribute('aria-pressed', 'false');
  await expect(augmentedReality).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project-card]:not([hidden])')).toHaveCount(2);
  await expect(page.locator('[data-project-card][hidden]')).toHaveCount(4);
});

test('keeps every project visible when JavaScript is unavailable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/work/');

  await expect(page.locator('[data-project-card]')).toHaveCount(6);
  await expect(page.locator('[data-project-card]:not([hidden])')).toHaveCount(6);
  await context.close();
});
