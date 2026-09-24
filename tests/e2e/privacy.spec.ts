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
    await page.setContent(readFileSync(`dist/${name}`, 'utf8'));
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
  page.on('request', request => requests.push(request.url()));
  await page.getByLabel('Words for the ecosystem').fill('private words stay here');
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('button', { name: 'Skip to Result' }).click();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.reload();
  await expect(page.getByLabel('Words for the ecosystem')).not.toHaveValue('private words stay here');
});
