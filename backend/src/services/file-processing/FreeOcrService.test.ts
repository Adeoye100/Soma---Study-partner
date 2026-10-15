import { freeOcrService } from './FreeOcrService';
import { FileSecurityValidator, createFileValidationConfig } from './FileSecurityValidator';
import JSZip from 'jszip';

describe('Document Upload & Extraction Pipeline', () => {
  const validator = new FileSecurityValidator(createFileValidationConfig(10 * 1024 * 1024, false));

  describe('FileSecurityValidator', () => {
    it('accepts valid text buffer', async () => {
      const textBuffer = Buffer.from('This is a study note on Thermodynamics.');
      const res = await validator.validateBuffer(textBuffer, 'notes.txt', 'user123');
      expect(res.valid).toBe(true);
      expect(res.metadata?.extension).toBe('.txt');
    });

    it('rejects an executable disguised as a PDF', async () => {
      // MZ header for Windows EXE: 0x4D, 0x5A
      const fakeExeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const res = await validator.validateBuffer(fakeExeBuffer, 'fake_notes.pdf', 'user123');
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('MIME_TYPE_MISMATCH');
    });

    it('rejects files with unsupported extensions (.doc / .exe / .bmp)', async () => {
      const buffer = Buffer.from('some content');
      const res = await validator.validateBuffer(buffer, 'document.doc', 'user123');
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('INVALID_EXTENSION');
    });

    it('rejects oversized files', async () => {
      const smallValidator = new FileSecurityValidator(createFileValidationConfig(100, false));
      const largeBuffer = Buffer.alloc(200, 'A');
      const res = await smallValidator.validateBuffer(largeBuffer, 'large.txt', 'user123');
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('FILE_TOO_LARGE');
    });
  });

  describe('FreeOcrService Extractors', () => {
    it('extracts plain text and markdown directly', async () => {
      const buffer = Buffer.from('# Quantum Physics\nQuantum superposition allows particles to exist in multiple states simultaneously.');
      const result = await freeOcrService.extractText(buffer, 'physics.md', 'text/markdown');
      expect(result.text).toContain('Quantum superposition');
      expect(result.method).toBe('plain-text');
      expect(result.confidence).toBe(1.0);
    });

    it('extracts text from PPTX zip archives', async () => {
      const zip = new JSZip();
      const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
          <p:cSld>
            <p:spTree>
              <p:sp>
                <p:txBody>
                  <a:p><a:r><a:t>Introduction to Organic Chemistry</a:t></a:r></a:p>
                  <a:p><a:r><a:t>Carbon forms four covalent bonds.</a:t></a:r></a:p>
                </p:txBody>
              </p:sp>
            </p:spTree>
          </p:cSld>
        </p:sld>`;
      zip.file('ppt/slides/slide1.xml', slideXml);
      const pptxBuffer = await zip.generateAsync({ type: 'nodebuffer' });

      const result = await freeOcrService.extractText(pptxBuffer, 'chemistry.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      expect(result.text).toContain('Introduction to Organic Chemistry');
      expect(result.text).toContain('Carbon forms four covalent bonds.');
      expect(result.method).toBe('pptx-zip-xml');
    });
  });
});
