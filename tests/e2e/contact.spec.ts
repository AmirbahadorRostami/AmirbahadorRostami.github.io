import { expect, test } from '@playwright/test';

const endpoint = 'https://contact.test/submit';

function contrastRatio(foreground: string, background: string): number {
  const relativeLuminance = (color: string) => {
    const values = color.match(/\d+(?:\.\d+)?/g)?.map(Number);
    if (!values || values.length < 3) throw new Error(`Expected an RGB color, received ${color}`);

    const [red, green, blue] = values.map((value) => {
      const channel = value / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };

  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (first, second) => second - first,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

async function fillValidContactForm(page: import('@playwright/test').Page) {
  await page.getByLabel('Name').fill('Ada Lovelace');
  await page.getByLabel('Reply email').fill('ada@example.com');
  await page.getByLabel('What brings you here?').selectOption('commission');
  await page
    .getByLabel('Message')
    .fill('I would like to discuss a collaborative installation.');
}

test('submits a configured form and resets it after a successful response', async ({ page }) => {
  await page.route(endpoint, (route) => route.fulfill({ status: 200, body: '{}' }));
  await page.goto('/contact/');

  const form = page.locator('[data-contact-form]');
  await expect(form).toHaveAttribute('data-contact-endpoint', endpoint);
  await fillValidContactForm(page);

  const delivery = page.waitForRequest(endpoint);
  await page.getByRole('button', { name: 'Send message' }).click();
  await delivery;

  await expect(page.getByRole('status')).toHaveText('Thanks—your message is on its way.');
  await expect(page.getByLabel('Name')).toHaveValue('');
  await expect(page.getByLabel('Message')).toHaveValue('');
});

test('preserves fields and exposes a retry after a delivery failure', async ({ page }) => {
  await page.route(endpoint, (route) => route.fulfill({ status: 500, body: '{}' }));
  await page.goto('/contact/');
  await fillValidContactForm(page);

  const delivery = page.waitForRequest(endpoint);
  await page.getByRole('button', { name: 'Send message' }).click();
  await delivery;

  await expect(page.getByRole('status')).toHaveText(
    'That message could not be sent. Please try again.',
  );
  await expect(page.getByRole('button', { name: 'Retry message' })).toBeEnabled();
  await expect(page.getByLabel('Name')).toHaveValue('Ada Lovelace');
  await expect(page.getByLabel('Message')).toHaveValue(
    'I would like to discuss a collaborative installation.',
  );
});

test('blocks invalid local fields without contacting the delivery endpoint', async ({ page }) => {
  let deliveryRequest = false;
  page.on('request', (request) => {
    if (request.url() === endpoint) deliveryRequest = true;
  });

  await page.goto('/contact/');
  await page.getByLabel('Name').fill('');
  await page.getByLabel('Reply email').fill('not-an-email');
  await page.getByLabel('Message').fill('Too short');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByText('Tell me your name.')).toBeVisible();
  await expect(page.getByText('Enter a valid reply email.')).toBeVisible();
  await expect(page.getByText('Please include at least 20 characters.')).toBeVisible();
  expect(deliveryRequest).toBe(false);
});

test('generated contact HTML contains no email address or phone-number-shaped text', async ({ page }) => {
  const response = await page.request.get('/contact/');
  const html = await response.text();

  expect(html).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(html).not.toMatch(/\+?\d{1,3}[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
});

test('renders active contact-control boundaries with at least 3:1 contrast', async ({ page }) => {
  await page.goto('/contact/');

  const controls = await page
    .locator('[data-contact-form] input:not([name="company"]), [data-contact-form] select, [data-contact-form] textarea')
    .evaluateAll((elements) => {
      const surrounding = getComputedStyle(document.documentElement).backgroundColor;
      return elements.map((element) => {
        const styles = getComputedStyle(element);
        return { border: styles.borderTopColor, surrounding };
      });
    });

  const ratios = controls.map(({ border, surrounding }) => contrastRatio(border, surrounding));
  expect(ratios.every((ratio) => ratio >= 3), JSON.stringify(ratios)).toBe(true);
});
