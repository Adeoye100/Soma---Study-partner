import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '@/shared/utils/logger';

export interface ExtractionResult {
  text: string;
  confidence: number;
  pages: number;
  method: string;
  processingTimeMs: number;
}

/**
 * Free, open-source text extraction service
 * Supports: TXT, MD, DOCX, PNG, JPG (via OCR)
 * NO PDF support for demo
 */
export class FreeOcrService {

  async extractTextFromImage(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();
    try {
      logger.info('[FreeOcrService] Starting image OCR', { filePath });
      const { data: { text, confidence } } = await Tesseract.recognize(filePath, 'eng');
      const processingTime = Date.now() - startTime;
      logger.info('[FreeOcrService] Image OCR complete', { confidence: (confidence * 100).toFixed(2) + '%', textLength: text.length, processingTimeMs: processingTime });
      return {
        text: text || '',
        confidence: confidence || 0.8,
        pages: 1,
        method: 'tesseract-ocr',
        processingTimeMs: processingTime
      };
    } catch (error) {
      logger.error('[FreeOcrService] Image OCR failed:', error);
      throw new Error(`Image extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async extractTextFromWord(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();
    try {
      logger.info('[FreeOcrService] Starting Word extraction', { filePath });
      const mammoth = require('mammoth');
      const docxBuffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer: docxBuffer });
      const extractedText = result.value || '';
      const processingTime = Date.now() - startTime;
      logger.info('[FreeOcrService] Word extraction complete', { textLength: extractedText.length, processingTimeMs: processingTime });
      return {
        text: extractedText,
        confidence: 0.99,
        pages: 1,
        method: 'mammoth-docx',
        processingTimeMs: processingTime
      };
    } catch (error) {
      logger.error('[FreeOcrService] Word extraction failed:', error);
      throw new Error(`Word extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async extractTextFromPlainText(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();
    try {
      logger.info('[FreeOcrService] Reading text file', { filePath });
      const text = await fs.readFile(filePath, 'utf-8');
      const processingTime = Date.now() - startTime;
      logger.info('[FreeOcrService] Text complete', { textLength: text.length, processingTimeMs: processingTime });
      return {
        text,
        confidence: 1.0,
        pages: 1,
        method: 'plain-text',
        processingTimeMs: processingTime
      };
    } catch (error) {
      logger.error('[FreeOcrService] Text read failed:', error);
      throw new Error(`Text read failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async extractText(filePath: string, mimeType: string): Promise<ExtractionResult> {
    const ext = path.extname(filePath).toLowerCase().replace(/^\./, '');
    logger.info('[FreeOcrService] Routing extraction', { ext, mimeType });

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif'].includes(ext)) {
      return this.extractTextFromImage(filePath);
    }

    // Word documents
    if (ext === 'docx' || ext === 'doc') {
      return this.extractTextFromWord(filePath);
    }

    // Plain text
    if (ext === 'txt' || ext === 'md') {
      return this.extractTextFromPlainText(filePath);
    }

    // PDF not supported for demo
    if (ext === 'pdf') {
      throw new Error('PDF support temporarily disabled. Please use TXT, DOCX, or image files.');
    }

    throw new Error(`Unsupported file type: .${ext}. Supported: txt, md, docx, jpg, png, gif`);
  }
}

export const freeOcrService = new FreeOcrService();
