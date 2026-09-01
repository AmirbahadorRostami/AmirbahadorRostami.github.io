import { resolve } from 'node:path';
import { OPS, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFString,
} from 'pdf-lib';

export interface PdfPageAudit {
  annotationCount: number;
  bottomMargin: number;
  imageOperationCount: number;
  leftMargin: number;
  rightMargin: number;
  structureRoles: string[];
  text: string;
  topMargin: number;
}

export interface PdfAudit {
  actionObjectCount: number;
  attachmentCount: number;
  catalogHasLanguage: boolean;
  catalogHasStructureTree: boolean;
  embeddedFileObjectCount: number;
  externalUrlCount: number;
  fieldCount: number;
  formObjectCount: number;
  javascriptActionCount: number;
  language: string;
  marked: boolean;
  metadataText: string;
  openActionCount: number;
  pages: PdfPageAudit[];
  parserExposedText: string;
  searchableText: string;
  toUnicodeMapCount: number;
}

function structureRoles(node: unknown): string[] {
  if (!node || typeof node !== 'object') return [];
  const candidate = node as { children?: unknown[]; role?: string };

  return [
    ...(candidate.role ? [candidate.role] : []),
    ...(candidate.children ?? []).flatMap((child) => structureRoles(child)),
  ];
}

function mapSize(value: Map<unknown, unknown> | null): number {
  return value?.size ?? 0;
}

function decodePdfString(value: unknown): string {
  if (value instanceof PDFString || value instanceof PDFHexString) return value.decodeText();
  return value?.toString() ?? '';
}

function parserPropertyCount(value: unknown, properties: Set<string>): number {
  if (!value || typeof value !== 'object') return 0;
  if (Array.isArray(value)) {
    return value.reduce((count, child) => count + parserPropertyCount(child, properties), 0);
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (count, [key, child]) => count + (properties.has(key) && Boolean(child) ? 1 : 0) + parserPropertyCount(child, properties),
    0,
  );
}

export async function auditPdf(data: Uint8Array): Promise<PdfAudit> {
  const loadingTask = getDocument({
    data: new Uint8Array(data),
    standardFontDataUrl: `${resolve('node_modules/pdfjs-dist/standard_fonts')}/`,
  });
  const pdf = await loadingTask.promise;
  const metadata = await pdf.getMetadata();
  const attachments = await pdf.getAttachments();
  const fields = await pdf.getFieldObjects();
  const javascript = await pdf.getJSActions();
  const openAction = await pdf.getOpenAction();
  const outline = await pdf.getOutline();
  const markInfo = await pdf.getMarkInfo();
  const pages: PdfPageAudit[] = [];
  const parserObjects: unknown[] = [
    metadata.info,
    metadata.metadata?.getRaw?.() ?? '',
    attachments ? [...attachments.entries()] : [],
    fields ? [...fields.entries()] : [],
    javascript ? [...javascript.entries()] : [],
    openAction ? [...openAction.entries()] : [],
    outline,
  ];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent({ includeMarkedContent: true });
    const textItems = textContent.items.filter((item): item is typeof item & {
      height: number;
      str: string;
      transform: number[];
      width: number;
    } => 'str' in item);
    const annotations = await page.getAnnotations({ intent: 'display' });
    const structTree = await page.getStructTree();
    const operatorList = await page.getOperatorList();
    const [, , pageWidth, pageHeight] = page.view;
    const left = textItems.map((item) => item.transform[4]);
    const right = textItems.map((item) => item.transform[4] + item.width);
    const baseline = textItems.map((item) => item.transform[5]);
    const imageOperations = new Set([
      OPS.paintImageMaskXObject,
      OPS.paintImageMaskXObjectGroup,
      OPS.paintImageXObject,
      OPS.paintImageXObjectRepeat,
      OPS.paintInlineImageXObject,
      OPS.paintInlineImageXObjectGroup,
    ]);

    parserObjects.push(annotations, structTree);
    pages.push({
      annotationCount: annotations.length,
      bottomMargin: Math.min(...baseline),
      imageOperationCount: operatorList.fnArray.filter((operation) => imageOperations.has(operation)).length,
      leftMargin: Math.min(...left),
      rightMargin: pageWidth - Math.max(...right),
      structureRoles: structureRoles(structTree),
      text: textItems.map((item) => item.str).join(' '),
      topMargin: pageHeight - Math.max(...baseline),
    });
  }

  const lowLevel = await PDFDocument.load(new Uint8Array(data), { updateMetadata: false });
  const catalog = lowLevel.catalog;
  let formObjectCount = 0;
  let toUnicodeMapCount = 0;
  let actionObjectCount = 0;
  let embeddedFileObjectCount = 0;
  let externalUrlCount = parserPropertyCount(parserObjects, new Set(['url', 'unsafeUrl']));

  for (const [, object] of lowLevel.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFDict)) continue;
    const objectType = object.get(PDFName.of('Type'))?.toString();
    const actionKind = object.get(PDFName.of('S'))?.toString();
    if (object.has(PDFName.of('AcroForm')) || object.has(PDFName.of('FT'))) formObjectCount += 1;
    if (object.has(PDFName.of('ToUnicode'))) toUnicodeMapCount += 1;
    if (objectType === '/Action' || actionKind === '/JavaScript' || actionKind === '/URI') actionObjectCount += 1;
    if (object.has(PDFName.of('URI'))) externalUrlCount += 1;
    if (objectType === '/EmbeddedFile' || object.get(PDFName.of('Subtype'))?.toString() === '/EmbeddedFile') {
      embeddedFileObjectCount += 1;
    }
  }

  const language = decodePdfString(catalog.get(PDFName.of('Lang')));
  const info = metadata.info as Record<string, unknown>;
  const metadataText = JSON.stringify([
    metadata.info,
    metadata.metadata?.getRaw?.() ?? '',
  ]);

  await loadingTask.destroy();

  return {
    actionObjectCount,
    attachmentCount: mapSize(attachments),
    catalogHasLanguage: catalog.has(PDFName.of('Lang')),
    catalogHasStructureTree: catalog.has(PDFName.of('StructTreeRoot')),
    embeddedFileObjectCount,
    externalUrlCount,
    fieldCount: mapSize(fields),
    formObjectCount,
    javascriptActionCount: mapSize(javascript),
    language: language || String(info.Language ?? ''),
    marked: markInfo instanceof Map ? markInfo.get('Marked') === true : markInfo?.Marked === true,
    metadataText,
    openActionCount: mapSize(openAction),
    pages,
    parserExposedText: JSON.stringify(parserObjects),
    searchableText: pages.map((page) => page.text).join('\n'),
    toUnicodeMapCount,
  };
}
