/**
 * exam.ts — thin HTTP dispatcher for the exam domain.
 *
 * Responsibilities: validate, extract userId, call one ExamOrchestrator
 * method, shape the HTTP response. Nothing else.
 *
 * Security rules enforced here (D3 fix):
 *  - Every route requires authMiddleware.
 *  - Every makeOrchestrator() call forwards the user's JWT so the Supabase
 *    client is user-scoped and RLS enforces ownership at the DB layer.
 *  - Ownership for mutations (delete, submit) is also asserted inside
 *    ExamOrchestrator before any write (C1 fix).
 */
import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';
import { checkValidationResult, examValidation } from '@/middleware/requestValidator';
import { examGenerationValidation, answerSubmissionValidation } from '@/middleware/requestValidation';
import { aiGenerationThrottler } from '@/middleware/requestThrottling';
import { ExamOrchestrator } from '@/modules/exam-orchestrator';
import { SupabaseStoreAdapter } from '@/adapters/store/supabase.adapter';
import { generateExam, evaluateAnswer } from '@/services/geminiService';
import { createClient } from '@supabase/supabase-js';
import { config } from '@/config';
import { logger } from '@/shared/utils/logger';

// ── Composition root helper ───────────────────────────────────────────────────
// Always pass authToken so the Supabase client is user-scoped (RLS-safe).
// This is the single place where adapters are wired into the orchestrator.

function makeOrchestrator(authToken: string): ExamOrchestrator {
  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${authToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return new ExamOrchestrator(
    new SupabaseStoreAdapter(client),
    generateExam,
    evaluateAnswer as any
  );
}

// Extract the Bearer token from a request — throws 401 if missing.
function requireToken(req: Request, res: Response): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing authorization header' });
    return null;
  }
  return authHeader.slice(7);
}

// ── Router ────────────────────────────────────────────────────────────────────

const router = Router();

// ── POST /api/exam/generate ───────────────────────────────────────────────────

router.post(
  '/generate',
  authMiddleware,
  [
    body('documentId').optional().isUUID().withMessage('Invalid document ID'),
    body('questionCount').optional().isInt({ min: 1, max: 50 }).withMessage('Question count must be 1-50'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  ],
  checkValidationResult,
  aiGenerationThrottler,
  examGenerationValidation,
  examValidation.createExam,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const { title, topics, subject, description, type, difficulty, numQuestions, timeLimit, materials } = req.body;

    try {
      const output = await makeOrchestrator(token).generate({
        userId, title, topics, subject, description, type, difficulty, numQuestions, timeLimit, materials,
      });
      return res.status(201).json({
        message: 'Exam generated successfully',
        exam: {
          id: output.exam.id, title: output.exam.title, description: output.exam.description,
          type: output.exam.type, difficulty: output.exam.difficulty,
          numQuestions: output.exam.num_questions, timeLimit: output.exam.time_limit,
          createdAt: output.exam.created_at,
        },
        questions: output.questions.map(q => ({
          id: q.id, question: q.question_text, questionType: q.question_type,
          options: q.options, difficulty: q.difficulty, topic: q.topic ?? null,
          orderIndex: q.order_index, points: q.points,
        })),
      });
    } catch (error: any) {
      logger.error('[exam/generate]', { message: error.message });
      return res.status(500).json({
        error: 'Exam generation failed', message: error.message,
        ...(error.message?.includes('No questions') ? { hint: 'Material may be too short.' } : {}),
      });
    }
  })
);

// ── POST /api/exam/submit ─────────────────────────────────────────────────────

router.post(
  '/submit',
  authMiddleware,
  body('examId').isUUID().withMessage('Valid exam ID is required'),
  body('answers').isArray({ min: 1 }).withMessage('At least one answer is required'),
  body('answers.*.questionId').isUUID().withMessage('Valid question ID is required'),
  body('answers.*.selectedOption').notEmpty().withMessage('Selected option is required'),
  checkValidationResult,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const { examId, answers } = req.body;
    try {
      const result = await makeOrchestrator(token).submit({ examId, answers, userId });
      return res.json({ message: 'Exam submitted successfully', result });
    } catch (error: any) {
      logger.error('[exam/submit]', { message: error.message });
      const status = error.message?.includes('Unauthorized') ? 403 : 500;
      return res.status(status).json({ error: 'Exam submission failed', message: error.message });
    }
  })
);

// ── POST /api/exam/evaluate ───────────────────────────────────────────────────

router.post(
  '/evaluate',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const { examId, answers, questions, question, answer, options, correctAnswer, topic } = req.body;

    try {
      const orchestrator = makeOrchestrator(token);

      // Mode A: full exam evaluation
      if (examId && answers && questions && Array.isArray(questions)) {
        const output = await orchestrator.evaluate({ examId, userId, answers, questions });
        return res.status(200).json({ success: true, ...output });
      }

      // Mode B: single-question evaluation
      if (question && answer !== undefined) {
        const evaluation = await orchestrator.evaluateSingle(
          question, answer, options ?? [], correctAnswer ?? '', topic ?? 'General'
        );
        return res.status(200).json({ evaluation });
      }

      return res.status(400).json({
        error: 'Invalid request',
        message: 'Provide { examId, answers, questions } or { question, answer, correctAnswer }.',
      });
    } catch (err: any) {
      logger.error('[exam/evaluate]', { message: err.message });
      return res.status(err.status ?? 500).json({
        error: 'Evaluation failed', message: err.message,
        ...(process.env.NODE_ENV === 'development' ? { details: err } : {}),
      });
    }
  })
);

// ── GET /api/exam/history ─────────────────────────────────────────────────────

router.get(
  '/history',
  authMiddleware,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('subject').optional().isString(),
  query('sortBy').optional().isIn(['created_at', 'percentage', 'score']),
  checkValidationResult,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const subject = req.query.subject as string | undefined;
    const sortBy = (req.query.sortBy as string) || 'created_at';

    try {
      const { data, total } = await makeOrchestrator(token).getHistory(userId, page, limit, subject, sortBy);
      return res.json({
        message: 'Exam history retrieved successfully',
        exams: data.map((r: any) => ({
          id: r.id, examId: r.exam_id,
          title: r.exam?.title ?? r.exams?.title ?? 'Untitled Exam',
          subject: r.exam?.title?.split(' - ')[0] ?? r.exams?.title?.split(' - ')[0] ?? 'General',
          score: r.score, percentage: r.percentage, passed: r.passed,
          timeTaken: r.time_taken, correctAnswers: r.correct_answers,
          totalQuestions: r.total_questions, dateTaken: r.created_at,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      logger.error('[exam/history]', { message: error.message });
      return res.status(500).json({ error: 'Failed to retrieve exam history', message: error.message });
    }
  })
);

// ── GET /api/exam ─────────────────────────────────────────────────────────────

router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const { data: exams, total } = await makeOrchestrator(token).getUserExams(userId, page, limit);
      return res.json({
        message: 'Exams retrieved successfully',
        exams: exams.map(e => ({
          id: e.id, title: e.title, description: e.description, type: e.type,
          difficulty: e.difficulty, numQuestions: e.num_questions, timeLimit: e.time_limit,
          createdAt: e.created_at, updatedAt: e.updated_at,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      logger.error('[exam/list]', { message: error.message });
      return res.status(500).json({ error: 'Failed to retrieve exams', message: error.message });
    }
  })
);

// ── GET /api/exam/:id ─────────────────────────────────────────────────────────

router.get(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const { id } = req.params;

    try {
      // Pass userId so cache key is user-scoped (D4)
      const result = await makeOrchestrator(token).getExam(id, userId);
      if (!result) return res.status(404).json({ error: 'Exam not found' });
      return res.json({
        message: 'Exam retrieved successfully',
        exam: {
          id: result.exam.id, title: result.exam.title, description: result.exam.description,
          type: result.exam.type, difficulty: result.exam.difficulty,
          numQuestions: result.exam.num_questions, timeLimit: result.exam.time_limit,
          createdAt: result.exam.created_at, updatedAt: result.exam.updated_at,
        },
        questions: result.questions.map(q => ({
          id: q.id, question: q.question_text, options: q.options, topic: q.topic ?? null,
        })),
      });
    } catch (error: any) {
      logger.error('[exam/get]', { message: error.message });
      return res.status(500).json({ error: 'Failed to retrieve exam', message: error.message });
    }
  })
);

// ── POST /api/exam/:id/answer ─────────────────────────────────────────────────

router.post(
  '/:id/answer',
  authMiddleware,
  answerSubmissionValidation,
  examValidation.submitAnswer,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const { questionId, answer } = req.body;

    try {
      const orchestrator = makeOrchestrator(token);
      const result = await orchestrator.getExam(req.params.id, userId);
      if (!result) return res.status(404).json({ error: 'Exam not found' });
      const question = result.questions.find(q => q.id === questionId);
      if (!question) return res.status(404).json({ error: 'Question not found' });

      const evaluation = await orchestrator.evaluateSingle(
        question.question_text, answer, question.options, question.correct_answer, question.topic ?? 'General'
      );
      return res.json({
        message: 'Answer evaluated successfully',
        evaluation: { score: evaluation.score, feedback: evaluation.feedback, isCorrect: evaluation.isCorrect, correctAnswer: question.correct_answer },
      });
    } catch (error: any) {
      logger.error('[exam/answer]', { message: error.message });
      return res.status(500).json({ error: 'Answer evaluation failed', message: error.message });
    }
  })
);

// ── POST /api/exam/:id/complete ───────────────────────────────────────────────

router.post(
  '/:id/complete',
  authMiddleware,
  examValidation.completeExam,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;
    const { answers } = req.body;

    try {
      const orchestrator = makeOrchestrator(token);
      const result = await orchestrator.getExam(req.params.id, userId);
      if (!result) return res.status(404).json({ error: 'Exam not found' });

      const qMap = new Map(result.questions.map(q => [q.id, q]));
      const evaluations: any[] = [];
      let totalScore = 0;
      let correctAnswers = 0;

      for (const ua of answers) {
        const q = qMap.get(ua.questionId);
        if (!q) continue;
        const ev = await orchestrator.evaluateSingle(q.question_text, ua.answer, q.options, q.correct_answer, q.topic ?? 'General');
        evaluations.push({ questionId: ua.questionId, ...ev });
        totalScore += ev.score;
        if (ev.isCorrect) correctAnswers++;
      }

      const finalScore = Math.round((totalScore / (answers.length * 10)) * 100);
      const percentage = Math.round((correctAnswers / answers.length) * 100);
      logger.info(`[exam/complete] Exam ${req.params.id} score ${finalScore}%`);
      return res.json({ message: 'Exam completed successfully', results: { score: finalScore, percentage, totalQuestions: answers.length, correctAnswers, evaluations } });
    } catch (error: any) {
      logger.error('[exam/complete]', { message: error.message });
      return res.status(500).json({ error: 'Exam completion failed', message: error.message });
    }
  })
);

// ── DELETE /api/exam/:id ──────────────────────────────────────────────────────

router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const token = requireToken(req, res);
    if (!token) return;
    const userId = req.user!.id;

    try {
      // C1: ownership check happens inside orchestrator.deleteExam
      await makeOrchestrator(token).deleteExam(req.params.id, userId);
      return res.json({ message: 'Exam deleted successfully' });
    } catch (error: any) {
      logger.error('[exam/delete]', { message: error.message });
      const status = error.message?.includes('Unauthorized') ? 403 : error.message?.includes('not found') ? 404 : 500;
      return res.status(status).json({ error: 'Exam deletion failed', message: error.message });
    }
  })
);

export default router;
