import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { auditPdf } from '../helpers/pdf-audit';

const organizations = [
  'Product Madness',
  'Sector Growth',
  'Artifacts Lab',
  'Hard Rock Digital',
  'Circuit Stream',
  'TerraZero',
  'Infinite Frame Media',
  'Antimodular Research',
  'Studio Above & Below',
  'BMS Lab, University of Twente',
  'AliceLab, York University',
  'Living Architecture Systems Group / Philip Beesley Architect',
  'York University',
];

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?<!\d)(?:\+?1[\s.()-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}(?!\d)/;

test('about page leads with the approved identity, portrait, and connective biography', async ({ page }) => {
  await page.goto('/about/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Part engineer. Part artist. Entirely curious.',
  );

  const portrait = page.getByRole('img', { name: /portrait of Amir Rostami/i });
  await expect(portrait).toHaveAttribute('loading', 'eager');
  await expect(portrait).toHaveAttribute('fetchpriority', 'high');

  const biography = page.locator('[data-about-biography]');
  await expect(biography).toContainText(/engineering/i);
  await expect(biography).toContainText(/art/i);
  await expect(biography).toContainText(/music/i);
  await expect(biography).toContainText(/creative technology/i);
  await expect(biography).toContainText(/human connection/i);
  await expect(biography).toContainText(/social communication/i);
});

test('about page renders all experience records in content order as a semantic timeline', async ({ page }) => {
  await page.goto('/about/');

  const timeline = page.locator('ol[data-timeline]');
  const entries = timeline.locator(':scope > li[data-timeline-entry]');
  await expect(timeline).toHaveCount(1);
  await expect(entries).toHaveCount(13);
  await expect(entries.locator('[data-timeline-organization]')).toHaveText(organizations);

  for (const entry of await entries.all()) {
    await expect(entry.locator('time, [data-timeline-period]')).toHaveCount(1);
    await expect(entry.getByRole('heading', { level: 3 })).not.toBeEmpty();
    await expect(entry.locator('[data-timeline-organization]')).not.toBeEmpty();
    await expect(entry.locator('[data-timeline-summary]')).not.toBeEmpty();
    expect((await entry.locator('[data-timeline-summary]').innerText()).length).toBeLessThan(220);
  }
});

test('about page provides education, contextual skills, and a private-safe resume download', async ({ page }) => {
  await page.goto('/about/');

  const education = page.getByRole('region', { name: 'Education' });
  await expect(education).toContainText('Bachelor of Science');
  await expect(education).toContainText('Computational Arts');
  await expect(education).toContainText('Game Development');

  const skills = page.getByRole('region', { name: 'Skills in context' });
  await expect(skills.getByRole('heading', { level: 3 })).toHaveText([
    'Engineering systems',
    'Creative technology',
    'Sound and music',
  ]);
  const siblingLandmarks = await page
    .locator('section[aria-label="Education"], section[aria-labelledby="skills-title"]')
    .evaluateAll(([educationSection, skillsSection]) => (
      educationSection.parentElement === skillsSection.parentElement &&
      !educationSection.contains(skillsSection) &&
      !skillsSection.contains(educationSection)
    ));
  expect(siblingLandmarks).toBe(true);

  const resume = page.getByRole('link', { name: /download.*résumé.*pdf/i });
  await expect(resume).toHaveAttribute('href', '/documents/Amir-Rostami-Resume.pdf');
  await expect(resume).toHaveAttribute('download', 'Amir-Rostami-Resume.pdf');

  const html = await page.content();
  expect(html).not.toMatch(emailPattern);
  expect(html).not.toMatch(phonePattern);

  const deployedResume = join(process.cwd(), 'dist/documents/Amir-Rostami-Resume.pdf');
  expect(statSync(deployedResume).size).toBeGreaterThan(1_000);

  const pdfAudit = await auditPdf(new Uint8Array(readFileSync(deployedResume)));
  const parserVisibleContent = [
    pdfAudit.searchableText,
    pdfAudit.metadataText,
    pdfAudit.parserExposedText,
  ].join('\n');
  expect(pdfAudit.searchableText).toContain('PROFESSIONAL EXPERIENCE');
  expect(parserVisibleContent).not.toMatch(emailPattern);
  expect(parserVisibleContent).not.toMatch(phonePattern);
  expect(pdfAudit.attachmentCount).toBe(0);
  expect(pdfAudit.embeddedFileObjectCount).toBe(0);
  expect(pdfAudit.fieldCount).toBe(0);
  expect(pdfAudit.actionObjectCount).toBe(0);
  expect(pdfAudit.externalUrlCount).toBe(0);
  expect(pdfAudit.javascriptActionCount).toBe(0);
  expect(pdfAudit.pages.every((pdfPage) => pdfPage.annotationCount === 0)).toBe(true);
  expect(pdfAudit.unreadableStreamCount).toBe(0);
});

test('about timeline remains readable without horizontal overflow', async ({ page }) => {
  const measure = async () => page.evaluate(() => {
    const entries = [...document.querySelectorAll<HTMLElement>('[data-timeline-entry]')];
    return {
      bodyOverflows: document.documentElement.scrollWidth > window.innerWidth,
      entryColumns: entries.map((entry) => getComputedStyle(entry).gridTemplateColumns.split(' ').length),
      entriesOverflow: entries.some((entry) => entry.scrollWidth > entry.clientWidth),
    };
  });

  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto('/about/');
  expect(await measure()).toEqual({
    bodyOverflows: false,
    entryColumns: Array(13).fill(3),
    entriesOverflow: false,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await measure()).toEqual({
    bodyOverflows: false,
    entryColumns: Array(13).fill(1),
    entriesOverflow: false,
  });
});

test('about portrait keeps a bounded 4:5 crop without distortion or overflow', async ({ page }) => {
  const measure = async () => page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>('.about-hero');
    const image = document.querySelector<HTMLImageElement>('.about-hero__portrait img');
    if (!hero || !image || !image.parentElement) throw new Error('Missing About portrait geometry.');

    const frame = image.parentElement;
    const frameRect = frame.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    return {
      frameAspect: frameRect.width / frameRect.height,
      heroHeight: hero.getBoundingClientRect().height,
      imageAspect: imageRect.width / imageRect.height,
      imageFillsFrame:
        Math.abs(imageRect.width - frameRect.width) < 1 &&
        Math.abs(imageRect.height - frameRect.height) < 1,
      objectFit: getComputedStyle(image).objectFit,
      overflows: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/about/');
  const desktop = await measure();
  expect(desktop.frameAspect).toBeCloseTo(4 / 5, 2);
  expect(desktop.imageAspect).toBeCloseTo(4 / 5, 2);
  expect(desktop.imageFillsFrame).toBe(true);
  expect(desktop.objectFit).toBe('cover');
  expect(desktop.heroHeight).toBeLessThanOrEqual(1000);
  expect(desktop.overflows).toBe(false);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await measure();
  expect(mobile.frameAspect).toBeCloseTo(4 / 5, 2);
  expect(mobile.imageAspect).toBeCloseTo(4 / 5, 2);
  expect(mobile.imageFillsFrame).toBe(true);
  expect(mobile.objectFit).toBe('cover');
  expect(mobile.heroHeight).toBeLessThanOrEqual(1450);
  expect(mobile.overflows).toBe(false);
});
