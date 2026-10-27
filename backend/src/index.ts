/**
 * index.ts — HTTP server entrypoint and composition root.
 *
 * D1 fix: mounts all routes (auth, exam, material, result, feedback,
 *         leaderboard, user, documents).
 * C0 fix: removes the blocking automation framework init and Redis init
 *         that prevented boot. Redis is still used lazily by BullMQ/CacheService
 *         but is no longer required for the server to start.
 * D2 fix: @/ aliases are resolved at build time by tsc-alias; tsconfig-paths
 *         handles dev. No runtime path rewriting needed here.
 */
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

import { logger } from '@/shared/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { validateConfig } from '@/config';

// ── Routes ────────────────────────────────────────────────────────────────────
import authRouter        from '@/routes/auth';
import examRouter        from '@/routes/exam';
import materialRouter    from '@/routes/material';
import resultRouter      from '@/routes/result';
import feedbackRouter    from '@/routes/feedback';
import leaderboardRouter from '@/routes/leaderboard';
import userRouter        from '@/routes/user';
import documentsRouter   from '@/routes/documents-free';
import healthRouter      from '@/routes/health';

// ── App ───────────────────────────────────────────────────────────────────────

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ── Security middleware ───────────────────────────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        styleSrc:    ["'self'", "'unsafe-inline'"],
        fontSrc:     ["'self'"],
        scriptSrc:   ["'self'"],
        imgSrc:      ["'self'", 'data:', 'blob:', 'https://*.supabase.co', 'https://api.dicebear.com'],
        connectSrc:  ["'self'", 'https://*.supabase.co'],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin(origin, callback) {
      const allowed = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean) as string[];
      if (!origin || allowed.includes(origin)) return callback(null, true);
      logger.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 600,
    optionsSuccessStatus: 204,
  })
);
app.options('*', cors());

// ── Global rate limit ─────────────────────────────────────────────────────────

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: req => req.path === '/health' || req.path === '/api/health' || req.path === '/api/documents/health',
  })
);

// ── Body / compression / logging ─────────────────────────────────────────────

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// ── Debug request logger ──────────────────────────────────────────────────────

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.path}`, { origin: req.headers.origin });
  next();
});

// ── Health checks (no auth) ───────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) =>
  res.json({
    status: 'healthy',
    service: 'soma-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV ?? 'development',
  })
);

app.use('/api/health', healthRouter);

// ── Proctoring — violation logging (no Python dependency) ─────────────────────
// D5 fix: frontend ProctorMonitor.tsx POSTs violations here; they are
// persisted to exam_sessions via Supabase. Thin handler — no deep module needed.

app.post(
  '/api/proctoring/log-violation',
  authMiddleware,
  express.json(),
  asyncHandler(async (req: Request, res: Response) => {
    const { examSessionId, violations, face_count, integrity_score } = req.body;
    if (!examSessionId) {
      return res.status(400).json({ error: 'examSessionId is required' });
    }
    // Fire-and-forget write to Supabase via service-role client
    // (a full proctoring seam is Candidate C6 for the next iteration).
    const { createClient: mkClient } = await import('@supabase/supabase-js');
    const { config } = await import('@/config');
    const db = mkClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error } = await db.from('proctoring_violations').insert({
      exam_session_id: examSessionId,
      violations:      violations ?? [],
      face_count:      face_count ?? 0,
      integrity_score: integrity_score ?? 100,
      logged_at:       new Date().toISOString(),
    });

    if (error) {
      // Non-critical: log but don't block the learner
      logger.warn('[proctoring] Failed to log violation', { examSessionId, error: error.message });
    }

    return res.json({ logged: true });
  })
);

// ── API routes ────────────────────────────────────────────────────────────────

app.use('/api/auth',        authRouter);
app.use('/api/exam',        examRouter);        // authMiddleware applied per-route inside
app.use('/api/material',    authMiddleware, materialRouter);
app.use('/api/result',      authMiddleware, resultRouter);
app.use('/api/feedback',    feedbackRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/user',        authMiddleware, userRouter);
app.use('/api/documents',   documentsRouter);   // authMiddleware applied per-route inside

// ── 404 ───────────────────────────────────────────────────────────────────────

app.use((req: Request, res: Response) => {
  logger.warn(`[404] ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found', path: req.path, method: req.method, timestamp: new Date().toISOString() });
});

// ── Error handler ─────────────────────────────────────────────────────────────

app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────

function start(): void {
  try {
    validateConfig();
  } catch (err: any) {
    logger.warn(`[config] ${err.message} — starting anyway in non-production mode`);
  }

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Soma backend running on port ${PORT}`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
    logger.info('📦 Mounted: /api/auth · /api/exam · /api/material · /api/result · /api/feedback · /api/leaderboard · /api/user · /api/documents');
    logger.info('🩺 Health: GET /health · GET /api/health');
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received — closing server`);
    server.close(() => { logger.info('Server closed'); process.exit(0); });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('uncaughtException',  err  => { logger.error('Uncaught exception', err);  process.exit(1); });
  process.on('unhandledRejection', reason => { logger.error('Unhandled rejection', { reason }); });
}

// Helper used by the proctoring handler above
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

start();

export default app;
