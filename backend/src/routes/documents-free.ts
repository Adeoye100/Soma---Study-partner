import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { freeOcrService, ExtractionResult } from '@/services/file-processing/FreeOcrService';
import { logger } from '@/shared/utils/logger';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['pdf', 'txt', 'md', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif', 'docx', 'doc'];
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (allowed.includes(ext ?? '')) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} not supported`));
    }
  }
});

/**
 * @route   POST /api/documents/extract-text
 * @desc    Extract text from uploaded file
 * @access  Private
 */
router.post(
  '/extract-text',
  authMiddleware,
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const processingStartTime = Date.now();
    
    try {
      const file = (req as any).file;
      const userId = (req as any).user?.id;

      if (!file) {
        return res.status(400).json({ 
          success: false,
          error: 'No file uploaded' 
        });
      }

      const ext = file.originalname.split('.').pop()?.toLowerCase();
      logger.info(`[documents] Processing file: ${file.originalname}`, {
        extension: ext,
        size: file.size,
        userId
      });

      // Save file temporarily
      const tmpDir = '/tmp';
      const tmpFileName = `soma_${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
      const tmpFilePath = path.join(tmpDir, tmpFileName);

      const fs = require('fs/promises');
      await fs.writeFile(tmpFilePath, file.buffer);

      // Extract text
      let extractionResult: ExtractionResult;
      try {
        extractionResult = await freeOcrService.extractText(tmpFilePath, file.mimetype);
      } finally {
        try {
          await fs.unlink(tmpFilePath);
        } catch (e) {
          logger.warn('[documents] Failed to delete temp file');
        }
      }

      const processingTime = Date.now() - processingStartTime;

      // ✅ SIMPLE, CLEAN RESPONSE
      return res.status(200).json({
        success: true,
        data: {
          text: extractionResult.text,
          fileName: file.originalname,
          fileSize: file.size,
          method: extractionResult.method,
          confidence: extractionResult.confidence,
          pages: extractionResult.pages,
          processingTimeMs: processingTime
        }
      });

    } catch (err: any) {
      const processingTime = Date.now() - processingStartTime;
      logger.error('[documents/extract-text] Error:', {
        error: err.message,
        processingTimeMs: processingTime
      });

      return res.status(500).json({
        success: false,
        error: 'File extraction failed',
        detail: err.message
      });
    }
  })
);

/**
 * @route   GET /api/documents/health
 * @desc    Health check
 * @access  Public
 */
router.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    service: 'document-extraction',
    status: 'healthy',
    processors: ['tesseract-ocr', 'pdf-parse', 'mammoth-docx', 'plain-text']
  });
});

export default router;
