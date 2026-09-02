import { resolve } from 'node:path';
import { OPS, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  decodePDFRawStream,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFRawStream,
  PDFRef,
  PDFStream,
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
  unreadableStreamCount: number;
}

function structureRoles(node: unknown, visited = new WeakSet<object>()): string[] {
  if (!node || typeof node !== 'object') return [];
  if (visited.has(node)) return [];
  visited.add(node);
  const candidate = node as { children?: unknown[]; role?: string };

  return [
    ...(candidate.role ? [candidate.role] : []),
    ...(candidate.children ?? []).flatMap((child) => structureRoles(child, visited)),
  ];
}

function mapSize(value: Map<unknown, unknown> | null): number {
  return value?.size ?? 0;
}

function decodePdfString(value: unknown): string {
  if (value instanceof PDFString || value instanceof PDFHexString) return value.decodeText();
  return value?.toString() ?? '';
}

function parserPropertyCount(
  value: unknown,
  properties: Set<string>,
  visited = new WeakSet<object>(),
): number {
  if (!value || typeof value !== 'object') return 0;
  if (visited.has(value)) return 0;
  visited.add(value);
  if (Array.isArray(value)) {
    return value.reduce((count, child) => count + parserPropertyCount(child, properties, visited), 0);
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (count, [key, child]) => count +
      (properties.has(key) && Boolean(child) ? 1 : 0) +
      parserPropertyCount(child, properties, visited),
    0,
  );
}

function decodedByteStrings(bytes: Uint8Array, isFontProgram: boolean): string[] {
  const utf8 = new TextDecoder('utf-8').decode(bytes);
  const latin1 = new TextDecoder('latin1').decode(bytes);
  const candidates = utf8 === latin1 ? [utf8] : [utf8, latin1];
  const printableBytes = [...bytes].filter((byte) => (
    byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte <= 126)
  )).length;
  const printableRatio = printableBytes / Math.max(bytes.length, 1);

  if (printableRatio < 0.75 && isFontProgram) {
    // Preserve every decoded binary byte without letting unrelated numeric bytes
    // concatenate into a phone-shaped false positive. ASCII email probes remain searchable.
    const embeddedEmails = candidates.flatMap((candidate) => (
      candidate.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? []
    ));
    const byteRepresentation = [...bytes]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(':');
    return [...new Set(embeddedEmails), byteRepresentation];
  }

  return candidates.map((candidate) => {
    // PDF drawing operands can resemble a phone number only when whitespace is
    // treated as a contact separator. Visible text is independently decoded by pdfjs.
    const isPdfContentSyntax = /(?:^|\s)(?:BDC|BT|ET|Tf|TJ|Tj|Tm)(?:\s|$)/m.test(candidate);
    return isPdfContentSyntax ? candidate.replace(/\s/g, '\u0000') : candidate;
  });
}

function collectLowLevelPayloads(document: PDFDocument) {
  const values: string[] = [];
  const fontPrograms = new WeakSet<object>();
  const visitedObjects = new WeakSet<object>();
  const visitedRefs = new Set<string>();
  let unreadableStreamCount = 0;

  for (const [, object] of document.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFDict)) continue;
    for (const key of ['CIDToGIDMap', 'FontFile', 'FontFile2', 'FontFile3']) {
      const candidate = object.get(PDFName.of(key));
      const resolved = candidate instanceof PDFRef ? document.context.lookup(candidate) : candidate;
      if (resolved && typeof resolved === 'object') fontPrograms.add(resolved);
    }
  }

  const visit = (object: unknown): void => {
    if (!object || typeof object !== 'object') return;

    if (object instanceof PDFRef) {
      if (visitedRefs.has(object.tag)) return;
      visitedRefs.add(object.tag);
      visit(document.context.lookup(object));
      return;
    }

    if (visitedObjects.has(object)) return;
    visitedObjects.add(object);

    if (object instanceof PDFString || object instanceof PDFHexString) {
      values.push(object.decodeText());
      return;
    }

    if (object instanceof PDFName) {
      values.push(object.decodeText());
      return;
    }

    if (object instanceof PDFRawStream) {
      visit(object.dict);
      try {
        values.push(...decodedByteStrings(
          decodePDFRawStream(object).decode(),
          fontPrograms.has(object),
        ));
      } catch {
        unreadableStreamCount += 1;
      }
      return;
    }

    if (object instanceof PDFStream) {
      visit(object.dict);
      unreadableStreamCount += 1;
      return;
    }

    if (object instanceof PDFArray) {
      for (const child of object.asArray()) visit(child);
      return;
    }

    if (object instanceof PDFDict) {
      for (const [key, child] of object.entries()) {
        visit(key);
        visit(child);
      }
    }
  };

  visit(document.catalog);
  for (const [ref] of document.context.enumerateIndirectObjects()) visit(ref);

  return { unreadableStreamCount, values };
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
  const lowLevelPayloads = collectLowLevelPayloads(lowLevel);
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
    parserExposedText: [JSON.stringify(parserObjects), ...lowLevelPayloads.values].join('\n'),
    searchableText: pages.map((page) => page.text).join('\n'),
    toUnicodeMapCount,
    unreadableStreamCount: lowLevelPayloads.unreadableStreamCount,
  };
}
