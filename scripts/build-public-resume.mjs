import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const templatePath = resolve(scriptDirectory, 'resume/public-resume.html');
const outputPath = resolve(projectRoot, 'public/documents/Amir-Rostami-Resume.pdf');
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?<!\d)(?:\+?1[\s.()-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}(?!\d)/;

const html = await readFile(templatePath, 'utf8');
if (emailPattern.test(html) || phonePattern.test(html)) {
  throw new Error('Public resume template failed generic privacy validation.');
}

const browser = await chromium.launch({ headless: true });
let taggedBytes;

try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  taggedBytes = await page.pdf({
    displayHeaderFooter: false,
    format: 'Letter',
    margin: {
      bottom: '0.55in',
      left: '0.55in',
      right: '0.55in',
      top: '0.55in',
    },
    outline: true,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  });
} finally {
  await browser.close();
}

const document = await PDFDocument.load(taggedBytes, { updateMetadata: false });
document.setTitle('Amir Rostami Resume', { showInWindowTitleBar: true });
document.setAuthor('Amir Rostami');
document.setSubject('Professional resume');
document.setCreator('Chromium tagged PDF pipeline');
document.setProducer('Chromium tagged PDF pipeline');

if (document.getPageCount() !== 2) {
  throw new Error(`Expected a two-page public resume, received ${document.getPageCount()} pages.`);
}

const finalBytes = await document.save({ useObjectStreams: false });
await writeFile(outputPath, finalBytes);

console.log(`pages_created=${document.getPageCount()}`);
console.log(`public_pdf_bytes=${finalBytes.byteLength}`);
console.log('template_email_pattern_count=0');
console.log('template_phone_pattern_count=0');
