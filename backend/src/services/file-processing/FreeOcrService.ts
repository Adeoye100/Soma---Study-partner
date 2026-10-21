import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';
import xml2js from 'xml2js';
import { createWorker, Worker } from 'tesseract.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/shared/utils/logger';
import { TextSanitizer } from './TextSanitizer';
import { ImageParser } from './parsers/ImageParser';

const execAsync = promisify(exec);
const pdfParse = require('pdf-parse');

export interface ExtractionResult {
  text: string;
  confidence: number;
  pages: number;
  method: string;
  processingTimeMs: number;
  warnings?: string[];
}

export class FreeOcrService {
  private sanitizer: TextSanitizer;
  private imageParser: ImageParser;
  private tesseractWorker: Worker | null = null;
  private workerInitPromise: Promise<Worker> | null = null;
  private activeOcrJobs = 0;
  private maxConcurrentOcr = 2;
  private ocrQueue: Array<() => void> = [];

  constructor() {
    this.sanitizer = new TextSanitizer();
    this.imageParser = new ImageParser();
  }

  /**
   * Acquire an OCR semaphore slot (limits concurrent OCR tasks to 2)
   */
  private async acquireOcrSlot(): Promise<void> {
    if (this.activeOcrJobs < this.maxConcurrentOcr) {
      this.activeOcrJobs++;
      return;
    }
    await new Promise<void>(resolve => {
      this.ocrQueue.push(resolve);
    });
    this.activeOcrJobs++;
  }

  /**
   * Release an OCR semaphore slot
   */
  private releaseOcrSlot(): void {
    this.activeOcrJobs--;
    if (this.ocrQueue.length > 0) {
      const next = this.ocrQueue.shift();
      if (next) next();
    }
  }

  /**
   * Get or initialize single reused Tesseract.js worker
   */
  private async getWorker(): Promise<Worker> {
    if (this.tesseractWorker) return this.tesseractWorker;

    if (!this.workerInitPromise) {
      this.workerInitPromise = (async () => {
        logger.info('[FreeOcrService] Initializing reusable Tesseract worker');
        const worker = await createWorker('eng');
        this.tesseractWorker = worker;
        return worker;
      })();
    }

    return this.workerInitPromise;
  }

  /**
   * Step 1.1: Plain text / Markdown
   */
  async extractTextFromPlainText(buffer: Buffer): Promise<ExtractionResult> {
    const startTime = Date.now();
    const text = buffer.toString('utf-8');
    const sanitized = this.sanitizer.sanitize(text);

    return {
      text: sanitized.text,
      confidence: 1.0,
      pages: 1,
      method: 'plain-text',
      processingTimeMs: Date.now() - startTime,
      warnings: sanitized.warnings
    };
  }

  /**
   * Step 1.2: DOCX extraction via Mammoth
   */
  async extractTextFromDocx(buffer: Buffer): Promise<ExtractionResult> {
    const startTime = Date.now();
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value || '';
    const sanitized = this.sanitizer.sanitize(text);

    return {
      text: sanitized.text,
      confidence: 0.99,
      pages: 1,
      method: 'mammoth-docx',
      processingTimeMs: Date.now() - startTime,
      warnings: [...sanitized.warnings, ...result.messages.map(m => m.message)]
    };
  }

  /**
   * Step 1.3: PPTX extraction by reading slide XML archives
   */
  async extractTextFromPptx(buffer: Buffer): Promise<ExtractionResult> {
    const startTime = Date.now();
    const zip = await JSZip.loadAsync(buffer);
    const parser = new xml2js.Parser();
    const slideTexts: string[] = [];

    // Find all slide XML files
    const slideFiles = Object.keys(zip.files).filter(name =>
      /^ppt\/slides\/slide\d+\.xml$/i.test(name)
    );

    // Sort slides in natural order
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

    for (const slidePath of slideFiles) {
      const slideXml = await zip.files[slidePath].async('string');
      try {
        const parsed = await parser.parseStringPromise(slideXml);
        const extracted: string[] = [];

        // Traverse XML object and collect all text nodes (a:t)
        const findTextNodes = (node: any) => {
          if (!node) return;
          if (typeof node === 'string') {
            extracted.push(node);
            return;
          }
          if (Array.isArray(node)) {
            node.forEach(findTextNodes);
            return;
          }
          if (typeof node === 'object') {
            for (const key of Object.keys(node)) {
              if (key === 'a:t' || key === 't') {
                const textVal = node[key];
                if (Array.isArray(textVal)) {
                  extracted.push(...textVal.filter((t: any) => typeof t === 'string'));
                } else if (typeof textVal === 'string') {
                  extracted.push(textVal);
                }
              } else {
                findTextNodes(node[key]);
              }
            }
          }
        };

        findTextNodes(parsed);
        const slideCombined = extracted.join(' ').trim();
        if (slideCombined) {
          slideTexts.push(slideCombined);
        }
      } catch (err) {
        logger.warn(`[FreeOcrService] Could not parse slide XML: ${slidePath}`);
      }
    }

    const fullText = slideTexts.join('\n\n--- Slide ---\n\n');
    const sanitized = this.sanitizer.sanitize(fullText);

    return {
      text: sanitized.text,
      confidence: 0.98,
      pages: Math.max(1, slideFiles.length),
      method: 'pptx-zip-xml',
      processingTimeMs: Date.now() - startTime,
      warnings: sanitized.warnings
    };
  }

  /**
   * Step 1.4: Digital PDF extraction
   */
  async extractTextFromPdf(buffer: Buffer): Promise<ExtractionResult> {
    const startTime = Date.now();
    try {
      const data = await pdfParse(buffer, { max: 20 });
      const rawText = data.text ? data.text.trim() : '';
      const pageCount = data.numpages || 1;

      // Scan detection: if extracted text has fewer than 50 non-whitespace characters, treat as scanned PDF
      if (rawText.replace(/\s+/g, '').length < 50) {
        logger.info('[FreeOcrService] PDF text content < 50 characters, triggering scanned PDF OCR pipeline');
        return this.extractScannedPdfWithOcr(buffer, pageCount);
      }

      const sanitized = this.sanitizer.sanitize(rawText);
      return {
        text: sanitized.text,
        confidence: 0.95,
        pages: pageCount,
        method: 'pdf-parse-digital',
        processingTimeMs: Date.now() - startTime,
        warnings: sanitized.warnings
      };
    } catch (err: any) {
      logger.warn('[FreeOcrService] Digital PDF parsing failed, trying OCR fallback', { error: err.message });
      return this.extractScannedPdfWithOcr(buffer, 1);
    }
  }

  /**
   * Step 2.1: Scanned PDF OCR (using poppler pdftoppm or Tesseract)
   */
  private async extractScannedPdfWithOcr(buffer: Buffer, estimatedPages = 1): Promise<ExtractionResult> {
    const startTime = Date.now();
    await this.acquireOcrSlot();

    const tempId = uuidv4();
    const tempDir = '/tmp';
    const tempPdfPath = path.join(tempDir, `scan_${tempId}.pdf`);
    const outputPrefix = path.join(tempDir, `page_${tempId}`);

    try {
      await fs.writeFile(tempPdfPath, buffer);

      // Check if pdftoppm is available to convert PDF pages to PNG
      let convertedImages: string[] = [];
      try {
        await execAsync(`pdftoppm -png -r 150 -f 1 -l 20 "${tempPdfPath}" "${outputPrefix}"`);
        const files = await fs.readdir(tempDir);
        convertedImages = files
          .filter(f => f.startsWith(`page_${tempId}`) && f.endsWith('.png'))
          .sort()
          .map(f => path.join(tempDir, f));
      } catch (ppmErr) {
        logger.warn('[FreeOcrService] pdftoppm not available or failed; using single page fallback', { error: ppmErr });
      }

      const ocrPageTexts: string[] = [];

      if (convertedImages.length > 0) {
        for (const imgPath of convertedImages) {
          const imgBuffer = await fs.readFile(imgPath);
          const pageResult = await this.performImageOcr(imgBuffer);
          if (pageResult.trim()) {
            ocrPageTexts.push(pageResult.trim());
          }
          await fs.unlink(imgPath).catch(() => {});
        }
      }

      const combinedText = ocrPageTexts.join('\n\n--- Page ---\n\n');
      const sanitized = this.sanitizer.sanitize(combinedText);

      return {
        text: sanitized.text || 'Scanned document processed. (Low text yield)',
        confidence: 0.85,
        pages: Math.max(1, convertedImages.length || estimatedPages),
        method: 'tesseract-scanned-pdf',
        processingTimeMs: Date.now() - startTime,
        warnings: sanitized.warnings
      };
    } finally {
      await fs.unlink(tempPdfPath).catch(() => {});
      this.releaseOcrSlot();
    }
  }

  /**
   * Step 2.2: Image OCR — prefers multimodal vision (OpenRouter/Gemini Flash),
   * falls back to Tesseract if the vision endpoint is unavailable or fails.
   */
  async extractTextFromImage(buffer: Buffer, originalName?: string): Promise<ExtractionResult> {
    const startTime = Date.now();
    const fileName = originalName || `image_${uuidv4()}.png`;

    // Primary: multimodal vision via OpenRouter (zero-cost, high-accuracy)
    try {
      logger.info('[FreeOcrService] Attempting multimodal vision OCR', { fileName });
      const parsed = await this.imageParser.parseBuffer(buffer, fileName);
      const text = parsed.text || '';

      if (text.replace(/\s+/g, '').length >= 10) {
        return {
          text,
          confidence: 0.95,
          pages: 1,
          method: 'multimodal-vision',
          processingTimeMs: Date.now() - startTime,
          warnings: parsed.sanitized.warnings
        };
      }

      logger.info('[FreeOcrService] Vision OCR returned insufficient text, falling back to Tesseract', { fileName, textLength: text.length });
    } catch (visionError: any) {
      logger.warn('[FreeOcrService] Multimodal vision OCR failed, falling back to Tesseract', {
        fileName,
        error: visionError.message
      });
    }

    // Fallback: Tesseract OCR
    await this.acquireOcrSlot();
    try {
      const rawText = await this.performImageOcr(buffer);
      const sanitized = this.sanitizer.sanitize(rawText);

      return {
        text: sanitized.text,
        confidence: 0.88,
        pages: 1,
        method: 'tesseract-ocr-fallback',
        processingTimeMs: Date.now() - startTime,
        warnings: sanitized.warnings
      };
    } finally {
      this.releaseOcrSlot();
    }
  }

  /**
   * Execute Image OCR via native CLI if available or shared Worker
   */
  private async performImageOcr(buffer: Buffer): Promise<string> {
    // Attempt native CLI tesseract first (faster and less memory in Linux container)
    const tempFile = path.join('/tmp', `ocr_${uuidv4()}.png`);
    try {
      await fs.writeFile(tempFile, buffer);
      const { stdout } = await execAsync(`tesseract "${tempFile}" stdout -l eng --oem 1 --psm 3`);
      return stdout;
    } catch {
      // Fallback to JS worker
      const worker = await this.getWorker();
      const ret = await worker.recognize(buffer);
      return ret.data.text || '';
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  }

  /**
   * Main router for extraction
   */
  async extractText(buffer: Buffer, originalName: string, mimeType: string): Promise<ExtractionResult> {
    const ext = path.extname(originalName).toLowerCase().replace(/^\./, '');
    logger.info('[FreeOcrService] Routing extraction', { originalName, ext, mimeType, size: buffer.length });

    // 1. Plain text / Markdown
    if (ext === 'txt' || ext === 'md' || mimeType.includes('text/')) {
      return this.extractTextFromPlainText(buffer);
    }

    // 2. Word (.docx only)
    if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.extractTextFromDocx(buffer);
    }

    // 3. PowerPoint (.pptx only)
    if (ext === 'pptx' || mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return this.extractTextFromPptx(buffer);
    }

    // 4. PDF (digital or scanned with automatic detection)
    if (ext === 'pdf' || mimeType === 'application/pdf') {
      return this.extractTextFromPdf(buffer);
    }

    // 5. Images (png, jpg, jpeg, webp)
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext) || mimeType.startsWith('image/')) {
      return this.extractTextFromImage(buffer, originalName);
    }

    throw new Error(`Unsupported file type: .${ext}. Allowed types: pdf, docx, pptx, txt, md, png, jpg, webp.`);
  }
}

export const freeOcrService = new FreeOcrService();
