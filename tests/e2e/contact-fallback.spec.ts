import { expect, test } from '@playwright/test';

test('an empty contact endpoint disables delivery controls and presents the fallback', async ({ page }) => {
  await page.goto('/contact/');

  const form = page.locator('[data-contact-form]');
  await expect(form).toHaveAttribute('data-contact-state', 'unconfigured');
  expect(await form.locator('[data-contact-control]').evaluateAll((controls) => (
    controls.every((control) => (control as HTMLButtonElement).disabled)
  ))).toBe(true);
  await expect(page.getByRole('button', { name: 'Form unavailable' })).toBeDisabled();
  await expect(page.locator('[data-contact-fallback]')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('The direct form is being connected.');
});
