import { expect, test } from '@playwright/test';

test('homepage primary and music actions have 44px targets and visible focus at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const links = page.locator('.hero__actions a, .music-card a');
  await expect(links).toHaveCount(5);
  for (const link of await links.all()) {
    await link.scrollIntoViewIfNeeded();
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    await link.focus();
    expect(await link.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test('Ephemeral contribution preserves the owner-confirmed responsibilities', async ({ page }) => {
  await page.goto('/work/ephemeral-pulses-of-a-finite-scroll/');
  const contribution = page.getByRole('heading', { name: 'My contribution', exact: true }).locator('..');
  for (const fact of ['co-created', 'Elahe Rostami', 'coding', 'hardware design', 'hardware sourcing', 'system integration', 'fabrication', 'assembly']) {
    await expect(contribution).toContainText(fact);
  }
});

test('BioWords clears invalid-input status on valid Begin and Restart', async ({ page }) => {
  await page.goto('/work/biowords/');
  const root = page.locator('[data-biowords]');
  await expect(root).toHaveAttribute('data-ready', 'true');
  const input = page.getByLabel('Words for the ecosystem');
  const status = page.locator('[data-biowords-status]');
  const begin = page.getByRole('button', { name: 'Begin', exact: true });
  const restart = page.getByRole('button', { name: 'Restart', exact: true });
  await input.fill('');
  await begin.click();
  await expect(status).toHaveText('Enter at least one word.');
  await input.fill('small bright worlds');
  await begin.click();
  await expect(status).toHaveText('The ecosystem is running.');
  await restart.click();
  await expect(status).toHaveText('Ready. Enter words and choose Begin.');
  await input.fill('');
  await begin.click();
  await expect(status).toHaveText('Enter at least one word.');
  await restart.click();
  await expect(status).toHaveText('Ready. Enter words and choose Begin.');
  await input.fill('small bright worlds');
  await begin.click();
  await expect(status).toHaveText('The ecosystem is running.');
});
