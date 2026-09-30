import { expect, test } from '@playwright/test';

test('accessible local lifecycle uses current input and original survivors', async ({ page }) => {
  await page.goto('/work/biowords/');
  const root = page.locator('[data-biowords]');
  await expect(root).toHaveAttribute('data-ready', 'true');
  await root.scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  const requests: { url: string; method: string; type: string }[] = [];
  page.on('request', r => requests.push({ url: r.url(), method: r.method(), type: r.resourceType() }));
  const unexpectedRequests = () => requests.filter(({ url, method, type }) => {
    const resource = new URL(url);
    return resource.origin !== new URL(page.url()).origin
      || !/^\/_astro\/(?:single-[love]|layered-[love]|love-example)\.[^/]+\.webp$/.test(resource.pathname)
      || method !== 'GET' || type !== 'image';
  });
  await page.getByLabel('Words for the ecosystem').fill('bright little signals gather');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(root).toHaveAttribute('data-status', 'paused');
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  const result = await page.locator('[data-biowords-result]').innerText();
  expect(result.trim().split(/\s+/).every(w => ['bright', 'little', 'signals', 'gather'].includes(w))).toBe(true);
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  await expect(page.locator('[data-biowords-result]')).toHaveText(result);
  await page.getByLabel('Words for the ecosystem').fill('new original words');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  expect((await page.locator('[data-biowords-result]').innerText()).split(/\s+/).every(w => ['new', 'original', 'words'].includes(w))).toBe(true);
  expect(unexpectedRequests()).toEqual([]);
  const secondResult = await page.locator('[data-biowords-result]').innerText();
  await page.getByLabel('Words for the ecosystem').fill('different words');
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  expect(await page.locator('[data-biowords-result]').innerText()).toBe(secondResult);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  expect((await page.locator('[data-biowords-result]').innerText()).split(' ').every(w => ['different', 'words'].includes(w))).toBe(true);
  expect(unexpectedRequests()).toEqual([]);
});

test('running time stops offscreen and when explicitly paused', async ({ page }) => {
  await page.goto('/work/biowords/');
  const root = page.locator('[data-biowords]');
  await expect(root).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect.poll(async () => Number(await root.getAttribute('data-elapsed'))).toBeGreaterThan(0);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(100);
  const elapsed = await root.getAttribute('data-elapsed');
  await page.waitForTimeout(150);
  expect(await root.getAttribute('data-elapsed')).toBe(elapsed);
});

test('other project pages contain no BioWords markup or resource entry', async ({ page }) => {
  for (const slug of ['encounters', 'luminous-trails', 'ephemeral-pulses-of-a-finite-scroll', 'person-is-a-data-structure']) {
    await page.goto(`/work/${slug}/`);
    await expect(page.locator('[data-biowords]')).toHaveCount(0);
    expect(await page.locator('script[src]').evaluateAll(scripts => scripts.map(s => s.getAttribute('src')).join(' '))).not.toMatch(/BioWords|controller|pixi/i);
    expect(await page.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).join(' '))).not.toMatch(/BioWords|controller|pixi/i);
  }
});

test('static prose and controls survive without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/work/biowords/');
  await expect(page.getByLabel('Words for the ecosystem')).toBeVisible();
  await expect(page.locator('[data-biowords] .fallback')).toBeVisible();
  await expect(page.locator('[data-biowords]')).not.toHaveAttribute('data-ready');
  await context.close();
});

test('reduced motion progresses only through explicit actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/biowords/');
  const root = page.locator('[data-biowords]');
  await expect(root).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect(root).toHaveAttribute('data-elapsed', '500');
  await page.waitForTimeout(200);
  await expect(root).toHaveAttribute('data-elapsed', '500');
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  await expect(root).toHaveAttribute('data-status', 'complete');
});

test('WebGL failure leaves HTML completion usable', async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
  await page.goto('/work/biowords/');
  await expect(page.locator('[data-biowords]')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  await expect(page.locator('[data-biowords-result]')).not.toBeEmpty();
});

test('live experiment keeps controls beside viewport and overlays the completed result', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/biowords/');
  const root = page.locator('[data-biowords]');
  await expect(root).toHaveAttribute('data-ready', 'true');
  const controls = root.locator('[data-biowords-panel]');
  const viewport = root.locator('[data-biowords-viewport]');
  const left = await controls.boundingBox();
  const right = await viewport.boundingBox();
  expect(left && right && left.x + left.width <= right.x + 8).toBe(true);
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await expect(root.locator('[data-biowords-creature-count]')).not.toHaveAttribute('data-biowords-creature-count', '0');
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  await expect(root.locator('[data-biowords-overlay]')).toBeVisible();
  await expect(root.locator('[data-biowords-result]')).not.toBeEmpty();
  await root.locator('[data-biowords-overlay] button').click();
  await expect(root.locator('[data-biowords-overlay]')).toBeHidden();
  await expect(root.locator('[data-biowords-creature-count]')).toHaveAttribute('data-biowords-creature-count', '0');
});

test('long results remain scrollable and Reset stays reachable on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/work/biowords/');
  const root = page.locator('[data-biowords]');
  await expect(root).toHaveAttribute('data-ready', 'true');
  await page.getByLabel('Words for the ecosystem').fill('constellation '.repeat(19).trim());
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  const overlay = root.locator('[data-biowords-overlay]');
  await expect(overlay).toBeVisible();
  await expect(root.locator('[data-biowords-word-list] li')).toHaveCount(19);
  expect(await overlay.evaluate(element => getComputedStyle(element).overflowY)).toBe('auto');
  const reset = overlay.getByRole('button', { name: /Reset experiment/ });
  await reset.scrollIntoViewIfNeeded();
  await reset.click();
  await expect(overlay).toBeHidden();
  await expect(root.locator('[data-biowords-creature-count]')).toHaveAttribute('data-biowords-creature-count', '0');
  await expect(root.locator('[data-biowords-word-list] li')).toHaveCount(0);
});
