import { expect, test } from '@playwright/test';

test('an empty contact endpoint disables delivery controls and presents the fallback', async ({ page }) => {
  await page.goto('/contact/');

  const form = page.locator('[data-contact-form]');
  await expect(form).toHaveAttribute('data-contact-state', 'unconfigured');
  await expect(form).not.toHaveAttribute('action');
  await expect(form).not.toHaveAttribute('data-contact-endpoint');
  expect(await form.locator('[data-contact-control]').evaluateAll((controls) => (
    controls.every((control) => (control as HTMLButtonElement).disabled)
  ))).toBe(true);
  await expect(page.getByRole('button', { name: 'Form unavailable' })).toBeDisabled();
  await expect(page.locator('[data-contact-fallback]')).toBeVisible();
  await expect(page.locator('[data-contact-fallback]')).toContainText('The direct form is being connected.');
  await expect(page.getByRole('link', { name: 'Find me on LinkedIn' })).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('The direct form is being connected.');
});
