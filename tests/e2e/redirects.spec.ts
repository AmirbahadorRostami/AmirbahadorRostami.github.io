import { expect, test } from '@playwright/test';

const redirects = [
  ['/work/remote-realities/', '/work/ephemeral-pulses-of-a-finite-scroll/'],
  ['/work/cellular-automata/', '/experiments/#cellular-automata'],
] as const;

for (const [source, target] of redirects) {
  test(`${source} exposes a static compatibility redirect`, async ({ page }) => {
    const response = await page.request.get(source);
    expect(response.ok()).toBe(true);

    const html = await response.text();
    expect(html).toContain(`<meta http-equiv="refresh" content="0;url=${target}">`);
    expect(html).toContain(`<a href="${target}">Continue to the current page</a>`);
  });

  test(`${source} navigates to its compatibility target`, async ({ page }) => {
    await page.goto(source);
    await expect.poll(() => new URL(page.url()).pathname + new URL(page.url()).hash).toBe(target);
  });
}
