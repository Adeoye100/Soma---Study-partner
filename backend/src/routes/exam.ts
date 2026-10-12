/**
 * exam.ts — thin HTTP dispatcher for the exam domain.
 *
 * Responsibilities of this file: validate, extract userId, call one
 * ExamOrchestrator method, shape the HTTP response. Nothing else.
 *
 * All business logic (exam creation, AI dispatch, question persistence,
 * status transitions, evaluation, scoring, session saving) lives in
 * modules/exam-orchestrator/index.ts.
 */
import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/auth';
import { checkValidationResult, examValidation } from '@/middleware/requestValidator';
import { examGenerationValidation, answerSubmissionValidation } from '@/middleware/requestValidation';
import { userRequestThrottler, aiGenerationThrottler } from '@/middleware/requestThrottling';
import { ExamOrchestrator } from '@/modules/exam-orchestrator';
import { SupabaseStoreAdapter } from '@/adapters/store/supabase.adapter';
import { generateExam, evaluateAnswer } from '@/services/geminiService';
import { createClient } from '@supabase/supabase-js';
import { config } from '@/config';
import { logger } from '@/shared/utils/logger';

// ── Composition: wire the deep module ────────────────────────────────────────
// In a future container.ts this wiring moves to the composition root.
// For now it lives here so no other file changes.

function makeOrchestrator(authToken?: string): ExamOrchestrator {
  const client = authToken
    ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${authToken}` } },
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

  return new ExamOrchestrator(
    new SupabaseStoreAdapter(client),
    generateExam,
    evaluateAnswer as any
  );
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
  asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing authorization header' });
    }
    const authToken = authHeader.slice(7);
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });

    const { title, topics, subject, description, type, difficulty, numQuestions, timeLimit, materials } = req.body;

    try {
      const orchestrator = makeOrchestrator(authToken);
      const output = await orchestrator.generate({
        userId, title, topics, subject, description,
        type, difficulty, numQuestions, timeLimit, materials,
      });

      return res.status(201).json({
        message: 'Exam generated successfully',
        exam: {
          id:          output.exam.id,
          title:       output.exam.title,
          description: output.exam.description,
          type:        output.exam.type,
          difficulty:  output.exam.difficulty,
          numQuestions: output.exam.num_questions,
          timeLimit:   output.exam.time_limit,
          createdAt:   output.exam.created_at,
        },
        questions: output.questions.map(q => ({
          id:           q.id,
          question:     q.question_text,
          questionType: q.question_type,
          options:      q.options,
          difficulty:   q.difficulty,
          topic:        q.topic ?? null,
          orderIndex:   q.order_index,
          points:       q.points,
        })),
      });
    } catch (error: any) {
      logger.error('[exam/generate] Error:', { message: error.message });
      const hint = error.message?.includes('No questions were generated')
        ? 'The study material may be too short or have insufficient content.'
        : undefined;
      return res.status(500).json({
        error: 'Exam generation failed',
        message: error.message,
        ...(hint ? { hint } : {}),
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
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { examId, answers } = req.body;

    try {
      const result = await makeOrchestrator().submit({ examId, answers, userId });
      return res.json({ message: 'Exam submitted successfully', result });
    } catch (error: any) {
      logger.error('[exam/submit] Error:', { message: error.message });
      return res.status(500).json({ error: 'Exam submission failed', message: error.message });
    }
  })
);

// ── POST /api/exam/evaluate ───────────────────────────────────────────────────

router.post(
  '/evaluate',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing authorization header' });
    }
    const authToken = authHeader.slice(7);

    const { examId, answers, questions, question, answer, options, correctAnswer, topic } = req.body;

    try {
      const orchestrator = makeOrchestrator(authToken);

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
        message: 'Provide { examId, answers, questions } for full evaluation, or { question, answer, correctAnswer } for single.',
      });
    } catch (err: any) {
      logger.error('[exam/evaluate] Error:', { message: err.message });
      return res.status(err.status ?? 500).json({
        error: err.error ?? 'Evaluation failed',
        message: err.message ?? 'An error occurred during evaluation',
        ...(process.env.NODE_ENV === 'development' ? { details: err } : {}),
      });
    }
  })
);

// ── GET /api/exam/history ─────────────────────────────────────────────────────

router.get(
  '/history',
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('subject').optional().isString(),
  query('sortBy').optional().isIn(['created_at', 'percentage', 'score']).withMessage('Invalid sort field'),
  checkValidationResult,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const page    = parseInt(req.query.page as string) || 1;
    const limit   = parseInt(req.query.limit as string) || 10;
    const subject = req.query.subject as string | undefined;
    const sortBy  = req.query.sortBy as string || 'created_at';

    try {
      const { data, total } = await makeOrchestrator().getHistory(userId, page, limit, subject, sortBy);
      return res.json({
        message: 'Exam history retrieved successfully',
        exams: data.map((r: any) => ({
          id:             r.id,
          examId:         r.exam_id,
          title:          r.exam?.title ?? r.exams?.title ?? 'Untitled Exam',
          subject:        r.exam?.title?.split(' - ')[0] ?? r.exams?.title?.split(' - ')[0] ?? 'General',
          score:          r.score,
          percentage:     r.percentage,
          passed:         r.passed,
          timeTaken:      r.time_taken,
          correctAnswers: r.correct_answers,
          totalQuestions: r.total_questions,
          dateTaken:      r.created_at,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      logger.error('[exam/history] Error:', { message: error.message });
      return res.status(500).json({ error: 'Failed to retrieve exam history', message: error.message });
    }
  })
);

// ── GET /api/exam/:id ─────────────────────────────────────────────────────────

router.get(
  '/:id',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Exam ID is required' });

    try {
      const result = await makeOrchestrator().getExam(id);
      if (!result) return res.status(404).json({ error: 'Exam not found' });

      return res.json({
        message: 'Exam retrieved successfully',
        exam: {
          id:           result.exam.id,
          title:        result.exam.title,
          description:  result.exam.description,
          type:         result.exam.type,
          difficulty:   result.exam.difficulty,
          numQuestions: result.exam.num_questions,
          timeLimit:    result.exam.time_limit,
          createdAt:    result.exam.created_at,
          updatedAt:    result.exam.updated_at,
        },
        questions: result.questions.map(q => ({
          id:       q.id,
          question: q.question_text,
          options:  q.options,
          topic:    q.topic ?? null,
        })),
      });
    } catch (error: any) {
      logger.error('[exam/get] Error:', { message: error.message });
      return res.status(500).json({ error: 'Failed to retrieve exam', message: error.message });
    }
  })
);

// ── GET /api/exam ─────────────────────────────────────────────────────────────

router.get(
  '/',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const page  = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const { data: exams, total } = await makeOrchestrator().getUserExams(userId, page, limit);
      return res.json({
        message: 'Exams retrieved successfully',
        exams: exams.map(e => ({
          id:           e.id,
          title:        e.title,
          description:  e.description,
          type:         e.type,
          difficulty:   e.difficulty,
          numQuestions: e.num_questions,
          timeLimit:    e.time_limit,
          createdAt:    e.created_at,
          updatedAt:    e.updated_at,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error: any) {
      logger.error('[exam/list] Error:', { message: error.message });
      return res.status(500).json({ error: 'Failed to retrieve exams', message: error.message });
    }
  })
);

// ── POST /api/exam/:id/answer ─────────────────────────────────────────────────

router.post(
  '/:id/answer',
  answerSubmissionValidation,
  examValidation.submitAnswer,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const examId = req.params.id;
    if (!examId) return res.status(400).json({ error: 'Exam ID is required' });
    const { questionId, answer } = req.body;

    try {
      const orchestrator = makeOrchestrator();
      const result = await orchestrator.getExam(examId);
      if (!result) return res.status(404).json({ error: 'Exam not found' });

      const question = result.questions.find(q => q.id === questionId);
      if (!question) return res.status(404).json({ error: 'Question not found' });

      const evaluation = await orchestrator.evaluateSingle(
        question.question_text,
        answer,
        question.options,
        question.correct_answer,
        question.topic ?? 'General'
      );

      return res.json({
        message: 'Answer evaluated successfully',
        evaluation: {
          score:         evaluation.score,
          feedback:      evaluation.feedback,
          isCorrect:     evaluation.isCorrect,
          correctAnswer: question.correct_answer,
        },
      });
    } catch (error: any) {
      logger.error('[exam/answer] Error:', { message: error.message });
      return res.status(500).json({ error: 'Answer evaluation failed', message: error.message });
    }
  })
);

// ── POST /api/exam/:id/complete ───────────────────────────────────────────────

router.post(
  '/:id/complete',
  examValidation.completeExam,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const examId = req.params.id;
    if (!examId) return res.status(400).json({ error: 'Exam ID is required' });
    const { answers } = req.body;

    try {
      const orchestrator = makeOrchestrator();
      const result = await orchestrator.getExam(examId);
      if (!result) return res.status(404).json({ error: 'Exam not found' });

      const qMap = new Map(result.questions.map(q => [q.id, q]));
      const evaluations: any[] = [];
      let totalScore = 0;
      let correctAnswers = 0;

      for (const ua of answers) {
        const q = qMap.get(ua.questionId);
        if (!q) continue;
        const ev = await orchestrator.evaluateSingle(
          q.question_text, ua.answer, q.options, q.correct_answer, q.topic ?? 'General'
        );
        evaluations.push({ questionId: ua.questionId, ...ev });
        totalScore += ev.score;
        if (ev.isCorrect) correctAnswers++;
      }

      const finalScore = Math.round((totalScore / (answers.length * 10)) * 100);
      const percentage  = Math.round((correctAnswers / answers.length) * 100);

      logger.info(`[exam/complete] Exam ${examId} completed with score ${finalScore}%`);

      return res.json({
        message: 'Exam completed successfully',
        results: { score: finalScore, percentage, totalQuestions: answers.length, correctAnswers, evaluations },
      });
    } catch (error: any) {
      logger.error('[exam/complete] Error:', { message: error.message });
      return res.status(500).json({ error: 'Exam completion failed', message: error.message });
    }
  })
);

// ── DELETE /api/exam/:id ──────────────────────────────────────────────────────

router.delete(
  '/:id',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Exam ID is required' });

    try {
      const orchestrator = makeOrchestrator();
      const result = await orchestrator.getExam(id);
      if (!result) return res.status(404).json({ error: 'Exam not found' });

      await orchestrator.deleteExam(id);
      return res.json({ message: 'Exam deleted successfully' });
    } catch (error: any) {
      logger.error('[exam/delete] Error:', { message: error.message });
      return res.status(500).json({ error: 'Exam deletion failed', message: error.message });
    }
  })
);

export default router;
