import { Router, Request, Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { freeOcrService, ExtractionResult } from '@/services/file-processing/FreeOcrService';
import { FileSecurityValidator, createFileValidationConfig } from '@/services/file-processing/FileSecurityValidator';
import { logger } from '@/shared/utils/logger';

const router = Router();

// File upload rate limiter: max 40 uploads per hour per user/IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 40,
  message: { error: 'Too many file uploads. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['pdf', 'docx', 'pptx', 'txt', 'md', 'png', 'jpg', 'jpeg', 'webp'];
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (allowed.includes(ext ?? '')) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} is not supported. Allowed formats: PDF, DOCX, PPTX, TXT, MD, PNG, JPG, WEBP.`));
    }
  }
});

const validator = new FileSecurityValidator(createFileValidationConfig(10 * 1024 * 1024, false));

/**
 * @route   POST /api/documents/extract-text
 * @desc    Extract text from uploaded file securely
 * @access  Private
 */
router.post(
  '/extract-text',
  authMiddleware,
  uploadLimiter,
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const processingStartTime = Date.now();
    
    try {
      const file = (req as any).file;
      const userId = (req as any).user?.id;

      if (!file || !file.buffer) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded or file is empty' 
        });
      }

      // Security check: validate magic bytes, MIME type, and size
      const validation = await validator.validateBuffer(file.buffer, file.originalname, userId);
      if (!validation.valid) {
        logger.warn('[documents/extract-text] Security validation failed', {
          fileName: file.originalname,
          error: validation.error,
          userId
        });
        return res.status(400).json({
          success: false,
          error: 'Invalid or unsupported file format',
          code: validation.error?.code || 'VALIDATION_FAILED'
        });
      }

      logger.info(`[documents] Processing verified file: ${file.originalname}`, {
        mimeType: validation.metadata?.detectedMimeType || file.mimetype,
        size: file.size,
        userId
      });

      // Extract text using robust multi-step extraction ladder
      const extractionResult: ExtractionResult = await freeOcrService.extractText(
        file.buffer,
        file.originalname,
        validation.metadata?.detectedMimeType || file.mimetype
      );

      const processingTime = Date.now() - processingStartTime;

      return res.status(200).json({
        success: true,
        data: {
          text: extractionResult.text,
          fileName: file.originalname,
          fileSize: file.size,
          method: extractionResult.method,
          confidence: extractionResult.confidence,
          pages: extractionResult.pages,
          warnings: extractionResult.warnings || [],
          processingTimeMs: processingTime
        }
      });

    } catch (err: any) {
      const processingTime = Date.now() - processingStartTime;
      logger.error('[documents/extract-text] Extraction error:', {
        error: err.message,
        stack: err.stack,
        processingTimeMs: processingTime
      });

      // Send sanitized, friendly error message to browser
      return res.status(500).json({
        success: false,
        error: 'Unable to extract text from document. Please ensure the file is not corrupted.',
        code: 'EXTRACTION_ERROR'
      });
    }
  })
);

/**
 * @route   GET /api/documents/health
 * @desc    Health check
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    service: 'document-extraction',
    status: 'healthy',
    processors: ['pdf-parse', 'mammoth-docx', 'pptx-zip-xml', 'tesseract-ocr', 'plain-text']
  });
});

export default router;
