import { deflateSync } from 'node:zlib';
import {
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFString,
} from 'pdf-lib';
import { describe, expect, test } from 'vitest';
import { auditPdf } from '../helpers/pdf-audit';

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phonePattern = /(?<!\d)(?:\+?1[\s.()-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}(?!\d)/;

async function fixturePdf(configure: (document: PDFDocument) => void | Promise<void>) {
  const document = await PDFDocument.create();
  document.addPage([200, 200]);
  await configure(document);
  return new Uint8Array(await document.save({ useObjectStreams: false }));
}

function privacySurface(audit: Awaited<ReturnType<typeof auditPdf>>) {
  return [audit.searchableText, audit.metadataText, audit.parserExposedText].join('\n');
}

describe('PDF audit adversarial payload traversal', () => {
  test('exposes literal, hex, nested, and cyclic low-level contact-shaped payloads', async () => {
    const literalProbe = 'catalog-probe@example.test';
    const hexProbe = 'hex-probe@example.test';
    const cycleProbe = '416-555-0137';
    const bytes = await fixturePdf((document) => {
      document.catalog.set(PDFName.of('SyntheticLiteral'), PDFString.of(literalProbe));
      document.catalog.set(PDFName.of('SyntheticHex'), PDFHexString.fromText(hexProbe));

      const first = document.context.obj({});
      const second = document.context.obj({
        Values: [document.context.obj({ Probe: PDFString.of(cycleProbe) })],
      });
      const firstRef = document.context.register(first);
      const secondRef = document.context.register(second);
      first.set(PDFName.of('Next'), secondRef);
      second.set(PDFName.of('Previous'), firstRef);
      document.catalog.set(PDFName.of('SyntheticCycle'), firstRef);
    });

    const surface = privacySurface(await auditPdf(bytes));

    expect(surface).toContain(literalProbe);
    expect(surface).toContain(hexProbe);
    expect(surface).toContain(cycleProbe);
    expect(surface).toMatch(emailPattern);
    expect(surface).toMatch(phonePattern);
  });

  test('decodes unfiltered, chained Flate, and compressed metadata streams', async () => {
    const unfilteredProbe = 'stream-probe@example.test';
    const chainedProbe = 'flate-chain-probe@example.test';
    const metadataProbe = 'metadata-probe@example.test';
    const binaryProbe = '647-555-0149';
    const bytes = await fixturePdf((document) => {
      const unfiltered = document.context.stream(unfilteredProbe);
      document.catalog.set(PDFName.of('SyntheticUnfiltered'), document.context.register(unfiltered));

      const twiceCompressed = deflateSync(deflateSync(Buffer.from(chainedProbe, 'utf8')));
      const chained = document.context.stream(twiceCompressed);
      chained.dict.set(
        PDFName.of('Filter'),
        document.context.obj([PDFName.of('FlateDecode'), PDFName.of('FlateDecode')]),
      );
      document.catalog.set(PDFName.of('SyntheticFlateChain'), document.context.register(chained));

      const xmp = `<?xpacket begin=""?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/" dc:description="${metadataProbe}"/></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
      const metadata = document.context.flateStream(xmp, {
        Type: 'Metadata',
        Subtype: 'XML',
      });
      document.catalog.set(PDFName.of('Metadata'), document.context.register(metadata));

      const binaryPayload = new Uint8Array([
        ...new Uint8Array(64),
        ...Buffer.from(binaryProbe, 'ascii'),
        ...new Uint8Array(64),
      ]);
      const binaryStream = document.context.flateStream(binaryPayload);
      document.catalog.set(PDFName.of('SyntheticBinaryStream'), document.context.register(binaryStream));
    });

    const audit = await auditPdf(bytes);
    const surface = privacySurface(audit);

    expect(surface).toContain(unfilteredProbe);
    expect(surface).toContain(chainedProbe);
    expect(surface).toContain(metadataProbe);
    expect(surface).toContain(binaryProbe);
    expect(surface).toMatch(emailPattern);
    expect(surface).toMatch(phonePattern);
    expect(audit.unreadableStreamCount).toBe(0);
  });

  test('exposes interactive annotations, forms, JavaScript, and attachment payloads', async () => {
    const annotationProbe = 'annotation-probe@example.test';
    const fieldProbe = 'field-probe@example.test';
    const scriptProbe = 'script-probe@example.test';
    const attachmentProbe = 'attachment-probe@example.test';
    const bytes = await fixturePdf(async (document) => {
      const page = document.getPages()[0];
      const uriAction = document.context.obj({
        S: 'URI',
        URI: PDFString.of(`mailto:${annotationProbe}`),
      });
      const annotation = document.context.obj({
        Type: 'Annot',
        Subtype: 'Link',
        Rect: [0, 0, 20, 20],
        Border: [0, 0, 0],
        A: document.context.register(uriAction),
      });
      page.node.set(
        PDFName.of('Annots'),
        document.context.obj([document.context.register(annotation)]),
      );

      const field = document.context.obj({
        FT: 'Tx',
        T: PDFString.of('Synthetic contact field'),
        V: PDFString.of(fieldProbe),
      });
      const acroForm = document.context.obj({
        Fields: [document.context.register(field)],
      });
      document.catalog.set(PDFName.of('AcroForm'), document.context.register(acroForm));

      const scriptAction = document.context.obj({
        Type: 'Action',
        S: 'JavaScript',
        JS: PDFString.of(`app.alert('${scriptProbe}')`),
      });
      document.catalog.set(PDFName.of('OpenAction'), document.context.register(scriptAction));

      await document.attach(Buffer.from(attachmentProbe, 'utf8'), 'synthetic-contact.txt', {
        description: 'Synthetic audit attachment',
        mimeType: 'text/plain',
      });
    });

    const audit = await auditPdf(bytes);
    const surface = privacySurface(audit);

    expect(surface).toContain(annotationProbe);
    expect(surface).toContain(fieldProbe);
    expect(surface).toContain(scriptProbe);
    expect(surface).toContain(attachmentProbe);
    expect(surface).toMatch(emailPattern);
    expect(audit.pages[0].annotationCount).toBeGreaterThan(0);
    expect(audit.externalUrlCount).toBeGreaterThan(0);
    expect(audit.formObjectCount).toBeGreaterThan(0);
    expect(audit.actionObjectCount).toBeGreaterThan(0);
    expect(audit.attachmentCount + audit.embeddedFileObjectCount).toBeGreaterThan(0);
    expect(audit.unreadableStreamCount).toBe(0);
  });

  test('fails closed when a stream filter cannot be decoded', async () => {
    const bytes = await fixturePdf((document) => {
      const stream = document.context.stream('opaque synthetic payload');
      stream.dict.set(PDFName.of('Filter'), PDFName.of('SyntheticDecode'));
      document.catalog.set(PDFName.of('SyntheticUnknownStream'), document.context.register(stream));
    });

    const audit = await auditPdf(bytes);

    expect(audit.unreadableStreamCount).toBeGreaterThan(0);
  });
});
