import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { auditPdf } from '../helpers/pdf-audit';

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?<!\d)(?:\+?1[\s.()-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}(?!\d)/;
const expectedHeadings = [
  'PROFESSIONAL SUMMARY',
  'CORE COMPETENCIES',
  'TECHNICAL SKILLS',
  'PROFESSIONAL EXPERIENCE',
  'NOTABLE PROJECTS & RESEARCH',
  'EDUCATION',
];

async function publicResumeAudit() {
  const bytes = await readFile(resolve('public/documents/Amir-Rostami-Resume.pdf'));
  return auditPdf(new Uint8Array(bytes));
}

describe('public resume PDF', () => {
  test('contains searchable professional content in reading order', async () => {
    const audit = await publicResumeAudit();

    expect(audit.pages).toHaveLength(2);
    expect(audit.pages.every((page) => page.text.length > 500)).toBe(true);
    expect(audit.searchableText.length).toBeGreaterThan(6_000);
    expect(expectedHeadings.every((heading) => audit.searchableText.includes(heading))).toBe(true);

    const headingOffsets = expectedHeadings.map((heading) => audit.searchableText.indexOf(heading));
    expect(headingOffsets).toEqual([...headingOffsets].sort((left, right) => left - right));
  });

  test('contains no private contact patterns or hidden interactive payloads', async () => {
    const audit = await publicResumeAudit();
    const authoringTemplate = await readFile(resolve('scripts/resume/public-resume.html'), 'utf8');
    const parserVisibleContent = [
      audit.searchableText,
      audit.metadataText,
      audit.parserExposedText,
    ].join('\n');

    expect(authoringTemplate).not.toMatch(emailPattern);
    expect(authoringTemplate).not.toMatch(phonePattern);
    expect(parserVisibleContent).not.toMatch(emailPattern);
    expect(parserVisibleContent).not.toMatch(phonePattern);
    expect(audit.attachmentCount).toBe(0);
    expect(audit.embeddedFileObjectCount).toBe(0);
    expect(audit.fieldCount).toBe(0);
    expect(audit.formObjectCount).toBe(0);
    expect(audit.actionObjectCount).toBe(0);
    expect(audit.externalUrlCount).toBe(0);
    expect(audit.javascriptActionCount).toBe(0);
    expect(audit.openActionCount).toBe(0);
    expect(audit.pages.every((page) => page.annotationCount === 0)).toBe(true);
    expect(audit.pages.every((page) => page.imageOperationCount === 0)).toBe(true);
    expect(audit.unreadableStreamCount).toBe(0);
  });

  test('is tagged in English with semantic structure, Unicode maps, and print-safe margins', async () => {
    const audit = await publicResumeAudit();
    const roles = new Set(audit.pages.flatMap((page) => page.structureRoles));

    expect(audit.catalogHasStructureTree).toBe(true);
    expect(audit.marked).toBe(true);
    expect(audit.catalogHasLanguage).toBe(true);
    expect(audit.language).toMatch(/^en(?:-|$)/i);
    expect(audit.pages.every((page) => page.structureRoles.length > 1)).toBe(true);
    expect(roles.has('H1')).toBe(true);
    expect(roles.has('H2')).toBe(true);
    expect(roles.has('P')).toBe(true);
    expect(roles.has('L')).toBe(true);
    expect(roles.has('LI')).toBe(true);
    expect(audit.toUnicodeMapCount).toBeGreaterThan(0);
    expect(audit.pages.every((page) => page.leftMargin >= 34)).toBe(true);
    expect(audit.pages.every((page) => page.rightMargin >= 34)).toBe(true);
    expect(audit.pages.every((page) => page.topMargin >= 34)).toBe(true);
    expect(audit.pages.every((page) => page.bottomMargin >= 34)).toBe(true);
  });
});
