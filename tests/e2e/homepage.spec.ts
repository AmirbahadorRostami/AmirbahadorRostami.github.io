import { expect, test } from '@playwright/test';

test('renders the homepage heading', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Professional maker of curious things.' }),
  ).toBeVisible();
});
