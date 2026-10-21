import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/auth';
import nodemailer from 'nodemailer';
import { TextSanitizer } from '@/services/file-processing/TextSanitizer';
import { logger } from '@/shared/utils/logger';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const sanitizer = new TextSanitizer();

// Safe Supabase Admin Initialization
let supabaseAdmin: SupabaseClient | null = null;
if (
  config.supabaseUrl &&
  config.supabaseServiceKey &&
  (config.supabaseUrl.startsWith('http://') || config.supabaseUrl.startsWith('https://'))
) {
  try {
    supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceKey);
  } catch (err: any) {
    logger.warn('[feedback] Supabase admin client initialization failed', { error: err.message });
  }
}

/**
 * Send feedback email notification via Resend API or Nodemailer SMTP
 */
async function sendFeedbackEmail(feedbackData: {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  userEmail?: string;
  pageUrl?: string;
  browserInfo?: string;
}): Promise<void> {
  const recipient = process.env.FEEDBACK_RECIPIENT_EMAIL || process.env.EMAIL_USER || 'adeoyeopeyemi951@gmail.com';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #4F46E5;">New Feedback Received</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p><strong>Type:</strong> ${feedbackData.type}</p>
        <p><strong>Severity:</strong> ${feedbackData.severity}</p>
        <p><strong>Title:</strong> ${feedbackData.title}</p>
        <p><strong>User Email:</strong> ${feedbackData.userEmail || 'Anonymous / Guest'}</p>
        <p><strong>Page URL:</strong> ${feedbackData.pageUrl || 'N/A'}</p>
        <p><strong>Browser:</strong> ${feedbackData.browserInfo || 'Unknown'}</p>
      </div>
      <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #334155;">Description:</h3>
        <p style="white-space: pre-wrap; color: #475569;">${feedbackData.description}</p>
      </div>
      <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px;">
        <p style="margin: 0; color: #0369a1; font-size: 13px;">
          <strong>Feedback ID:</strong> ${feedbackData.id}<br>
          <strong>Submitted:</strong> ${new Date().toISOString()}
        </p>
      </div>
    </div>
  `;

  // 1. Resend API route (zero-card, free tier)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Soma Feedback <onboarding@resend.dev>',
          to: [recipient],
          subject: `[Soma Feedback] ${feedbackData.type} - ${feedbackData.severity}: ${feedbackData.title}`,
          html: htmlContent,
        }),
      });

      if (response.ok) {
        logger.info('[feedback] Email notification sent successfully via Resend');
        return;
      }
      const errText = await response.text();
      logger.warn('[feedback] Resend API responded with error', { status: response.status, error: errText });
    } catch (err: any) {
      logger.warn('[feedback] Failed to send email via Resend', { error: err.message });
    }
  }

  // 2. Nodemailer SMTP / Gmail fallback
  if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `[Soma Feedback] ${feedbackData.type} - ${feedbackData.severity}: ${feedbackData.title}`,
        html: htmlContent,
      });

      logger.info('[feedback] Email notification sent successfully via Nodemailer');
      return;
    } catch (emailError: any) {
      logger.warn('[feedback] Failed to send feedback email via Nodemailer', { error: emailError.message });
    }
  }

  logger.info('[feedback] Email notification skipped (neither Resend nor Nodemailer configured)');
}

/**
 * GET /api/feedback/health
 */
router.get('/health', (_req, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'feedback-service',
    emailProviders: {
      resend: Boolean(process.env.RESEND_API_KEY),
      nodemailer: Boolean(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD),
    },
    database: Boolean(supabaseAdmin),
  });
});

/**
 * POST /api/feedback
 * Allows authenticated and guest users to submit feedback / bug reports
 */
router.post(
  '/',
  optionalAuthMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { type, title, description, severity, page_url } = req.body;

    if (!type || !title || !description || !severity) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'type, title, description, and severity are required',
      });
    }

    if (typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        error: 'Validation Error',
        details: 'title must be at least 3 characters long',
      });
    }

    if (typeof description !== 'string' || description.trim().length < 5) {
      return res.status(400).json({
        error: 'Validation Error',
        details: 'description must be at least 5 characters long',
      });
    }

    // Sanitize user inputs to prevent XSS / markup injection
    const sanitizedTitle = sanitizer.sanitize(title).text;
    const sanitizedDescription = sanitizer.sanitize(description).text;
    const sanitizedPageUrl = page_url ? sanitizer.sanitize(String(page_url)).text : undefined;

    const user = req.user;
    const userEmail = user?.email || (typeof req.body.email === 'string' ? req.body.email : undefined);
    const browserInfo = (req.headers['user-agent'] as string) || 'Unknown';

    let feedbackId = uuidv4();

    // Persist to Supabase if configured
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('feedback')
          .insert({
            user_id: user?.id || null,
            user_email: userEmail || null,
            type,
            title: sanitizedTitle,
            description: sanitizedDescription,
            severity,
            page_url: sanitizedPageUrl,
            browser_info: browserInfo,
            status: 'open',
            metadata: {},
          })
          .select('id')
          .single();

        if (!error && data?.id) {
          feedbackId = data.id;
        } else if (error) {
          logger.warn('[feedback] Database insert warning', { error: error.message });
        }
      } catch (dbErr: any) {
        logger.warn('[feedback] Database operation failed, continuing with fallback ID', { error: dbErr.message });
      }
    }

    // Send email notification asynchronously
    sendFeedbackEmail({
      id: feedbackId,
      type,
      title: sanitizedTitle,
      description: sanitizedDescription,
      severity,
      userEmail,
      pageUrl: sanitizedPageUrl,
      browserInfo,
    }).catch(err => {
      logger.warn('[feedback] Unhandled error during sendFeedbackEmail', { error: err.message });
    });

    return res.status(201).json({
      success: true,
      feedbackId,
      message: 'Feedback submitted successfully',
    });
  })
);

export default router;
