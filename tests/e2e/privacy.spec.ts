import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { auditPdf } from '../helpers/pdf-audit';

const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phone = /(?<!\d)(?:\+?1[\s.()-]*)?\(?\d{3}\)?[\s.-]+\d{3}[\s.-]+\d{4}(?!\d)/;

test('built HTML and scripts do not persist visitor input', () => {
  for (const name of readdirSync('dist', { recursive: true }).map(String).filter(name => /\.(html|js)$/.test(name))) {
    expect(readFileSync(`dist/${name}`, 'utf8'), name).not.toMatch(/localStorage|sessionStorage/);
  }
});

test('built HTML and public PDF expose no private contact details', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const name of readdirSync('dist', { recursive: true }).map(String).filter(name => name.endsWith('.html'))) {
    const html = readFileSync(`dist/${name}`, 'utf8');
    expect(html, `${name}: full emitted HTML`).not.toMatch(email);
    expect(html, `${name}: full emitted HTML`).not.toMatch(phone);
    await page.setContent(html);
    const attributes = await page.locator('*').evaluateAll(elements => elements.flatMap(el => [...el.attributes].map(attr => attr.value)).join('\n'));
    expect(attributes, `${name}: decoded attributes and metadata`).not.toMatch(email);
    expect(attributes, `${name}: decoded attributes and metadata`).not.toMatch(phone);
    const text = await page.locator('body').innerText();
    expect(text, name).not.toMatch(email);
    expect(text, name).not.toMatch(phone);
    expect(await page.locator('a[href^="mailto:"], a[href^="tel:"]').count(), name).toBe(0);
  }
  await context.close();
  const pdf = await auditPdf(new Uint8Array(readFileSync('dist/documents/Amir-Rostami-Resume.pdf')));
  const text = [pdf.searchableText, pdf.metadataText, pdf.parserExposedText].join('\n');
  expect(text).not.toMatch(email);
  expect(text).not.toMatch(phone);
});

test('BioWords input stays in memory and causes no outbound requests', async ({ page }) => {
  await page.goto('/work/biowords/');
  await expect(page.locator('[data-biowords]')).toHaveAttribute('data-ready', 'true');
  await page.waitForLoadState('networkidle');
  const requests: string[] = [];
  page.on('request', request => requests.push(`${request.url()} ${request.postData() ?? ''}`));
  await page.getByLabel('Words for the ecosystem').fill('private words stay here');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  await expect(page.locator('[data-biowords]')).toHaveAttribute('data-status', 'complete');
  await expect(page.locator('[data-biowords-result]')).not.toBeEmpty();
  // Allow completion callbacks and visibility lifecycle handlers to run before auditing.
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForTimeout(500);
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.reload();
  await expect(page.getByLabel('Words for the ecosystem')).not.toHaveValue('private words stay here');
  await page.waitForLoadState('networkidle');
  expect(requests.join('\n')).not.toMatch(/private|words(?:%20|\+| )stay/i);
});
