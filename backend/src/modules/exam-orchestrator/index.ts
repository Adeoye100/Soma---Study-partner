/**
 * ExamOrchestrator — deep module for exam lifecycle management.
 *
 * Interface (3 primary methods + 4 query methods):
 *   generate(input)    — AI generation → persist → return exam + questions
 *   evaluate(input)    — score answers, save session, mark exam completed
 *   submit(input)      — legacy submit path (answers array with selectedOption)
 *   getExam(id)
 *   getUserExams(userId, page, limit)
 *   getHistory(userId, page, limit, subject?, sortBy?)
 *   deleteExam(id)
 *
 * All Supabase client creation, status-state transitions (draft → processing →
 * completed / failed), question mapping, cache invalidation, and AI dispatch
 * live here. The HTTP route in routes/exam.ts becomes a thin dispatcher.
 *
 * Dependencies are injected — never created internally:
 *   store   : SomaStore   (SupabaseStoreAdapter in prod, InMemoryStore in tests)
 *   generateAI : (config, materials) => Question[]  (geminiService.generateExam)
 *   evaluateAI : (question, answer)  => EvaluationResult (geminiService.evaluateAnswer)
 */
import {
  SomaStore,
  ExamRow,
  QuestionRow,
  ExamResultRow,
  ExamSessionRow,
  Page,
} from '@/seams/soma-store';
import { logger } from '@/shared/utils/logger';

// ── Re-exported from geminiService shape ──────────────────────────────────────

export interface AIExamConfig {
  subject: string;
  type: 'OBJECTIVE' | 'SHORT_ANSWER' | 'ESSAY' | 'TRUE_FALSE';
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  timeLimit?: number;
}

export interface AIMaterial {
  content: string;
  mimeType: string;
  title?: string;
}

export interface AIQuestion {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  difficulty?: string;
  topic?: string;
  subject?: string;
  order_index?: number;
  points?: number;
}

export interface AIEvaluationResult {
  score: number;
  feedback: string;
  isCorrect: boolean;
  topic: string;
}

// ── Input / output types ──────────────────────────────────────────────────────

export interface GenerateInput {
  userId: string;
  title?: string;
  topics: string;
  subject?: string;
  description?: string;
  type: 'OBJECTIVE' | 'SHORT_ANSWER' | 'ESSAY' | 'TRUE_FALSE';
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  timeLimit?: number;
  materials: AIMaterial[];
}

export interface GenerateOutput {
  exam: Pick<ExamRow, 'id' | 'title' | 'description' | 'type' | 'difficulty' | 'num_questions' | 'time_limit' | 'created_at'>;
  questions: Array<Pick<QuestionRow, 'id' | 'question_text' | 'question_type' | 'options' | 'difficulty' | 'topic' | 'order_index' | 'points'>>;
}

export interface EvaluateQuestionInput {
  id: string;
  question_text?: string;
  question?: string;
  question_type?: string;
  type?: string;
  options?: string[];
  correct_answer?: string;
  correctAnswer?: string;
  topic?: string;
  points?: number;
}

export interface EvaluateInput {
  examId: string;
  userId: string;
  answers: Record<string, string>; // questionId → answer text
  questions: EvaluateQuestionInput[];
}

export interface EvaluateOutput {
  sessionId?: string;
  score: number;
  maxScore: number;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    score: number;
    userAnswer: string;
    correctAnswer: string;
    feedback: string;
    topic: string;
  }>;
}

export interface SubmitInput {
  examId: string;
  userId: string;
  answers: Array<{ questionId: string; selectedOption: string }>;
}

export interface SubmitOutput {
  examId: string;
  userId: string;
  score: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: Array<{
    questionId: string;
    selectedOption: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

// ── Injected AI function types ────────────────────────────────────────────────

export type GenerateAIFn = (config: AIExamConfig, materials: AIMaterial[]) => Promise<AIQuestion[]>;
export type EvaluateAIFn = (
  question: { question_text: string; options: string[]; correct_answer: string; topic: string },
  answer: { answer: string }
) => Promise<AIEvaluationResult>;

// ── ExamOrchestrator ──────────────────────────────────────────────────────────

export class ExamOrchestrator {
  constructor(
    private readonly store: SomaStore,
    private readonly generateAI: GenerateAIFn,
    private readonly evaluateAI: EvaluateAIFn
  ) {}

  // ── generate ───────────────────────────────────────────────────────────────

  async generate(input: GenerateInput): Promise<GenerateOutput> {
    const topicList = input.topics.split(',').map(t => t.trim());
    const derivedTitle =
      input.title ??
      topicList.slice(0, 3).join(', ') + (topicList.length > 3 ? '…' : '');

    // 1. Create exam record (status: draft)
    const exam = await this.store.createExam({
      title: derivedTitle,
      description: input.description ?? `Exam covering ${topicList.length} topic(s)`,
      type: input.type,
      difficulty: input.difficulty,
      num_questions: input.numQuestions,
      time_limit: input.timeLimit,
      user_id: input.userId,
      status: 'draft',
    });

    // 2. Mark processing
    await this.store.updateExamStatus(exam.id, 'processing');

    // 3. AI generation — fail cleanly if it throws
    let generatedQuestions: AIQuestion[];
    try {
      generatedQuestions = await this.generateAI(
        {
          subject: input.subject ?? topicList[0] ?? 'General',
          type: input.type,
          difficulty: input.difficulty,
          numQuestions: input.numQuestions,
          timeLimit: input.timeLimit,
        },
        input.materials
      );
    } catch (err: any) {
      await this.store.updateExamStatus(exam.id, 'failed', { error: err.message });
      throw err; // route will translate to 500
    }

    if (!generatedQuestions || generatedQuestions.length === 0) {
      await this.store.updateExamStatus(exam.id, 'failed', {
        error: 'AI returned 0 questions',
      });
      throw new Error('No questions were generated. The material may be too short.');
    }

    logger.info(
      `[ExamOrchestrator] Generated ${generatedQuestions.length} questions for exam ${exam.id}. ` +
      `Sample: "${generatedQuestions[0]?.question_text?.slice(0, 60)}"`
    );

    // 4. Persist questions
    const questionRows = generatedQuestions.map((q, index) => ({
      exam_id: exam.id,
      user_id: input.userId,
      question_text: q.question_text,
      question_type: (q.question_type ?? input.type) as QuestionRow['question_type'],
      options: q.options ?? [],
      correct_answer: q.correct_answer,
      explanation: q.explanation ?? undefined,
      difficulty: (q.difficulty ?? input.difficulty) as QuestionRow['difficulty'],
      order_index: typeof q.order_index === 'number' ? Math.max(0, q.order_index) : index,
      points: q.points ?? 10,
      topic: q.topic ?? 'General',
      subject: q.subject ?? input.subject ?? topicList[0] ?? 'General',
      metadata: {
        topic: q.topic ?? 'General',
        subject: q.subject ?? input.subject ?? 'General',
      },
    }));

    let savedQuestions: QuestionRow[];
    try {
      savedQuestions = await this.store.insertQuestions(questionRows);
    } catch (err: any) {
      await this.store.updateExamStatus(exam.id, 'failed', { error: err.message });
      throw err;
    }

    // 5. Mark completed
    await this.store.updateExamStatus(exam.id, 'completed');

    return {
      exam: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        type: exam.type,
        difficulty: exam.difficulty,
        num_questions: exam.num_questions,
        time_limit: exam.time_limit,
        created_at: exam.created_at,
      },
      questions: savedQuestions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        difficulty: q.difficulty,
        topic: q.topic,
        order_index: q.order_index,
        points: q.points,
      })),
    };
  }

  // ── evaluate ───────────────────────────────────────────────────────────────

  async evaluate(input: EvaluateInput): Promise<EvaluateOutput> {
    const results = await Promise.all(
      input.questions.map(async q => {
        const userAnswer = input.answers[q.id] ?? '';
        const qType = (q.question_type ?? q.type ?? 'OBJECTIVE').toUpperCase();
        const correctAnswer = q.correct_answer ?? q.correctAnswer ?? '';

        // Objective / True-False: direct comparison — no AI call
        if (qType === 'OBJECTIVE' || qType === 'TRUE_FALSE') {
          const isCorrect =
            userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
          return {
            questionId: q.id,
            isCorrect,
            score: isCorrect ? (q.points ?? 10) : 0,
            userAnswer,
            correctAnswer,
            feedback: isCorrect
              ? 'Correct!'
              : `Incorrect. The correct answer is: ${correctAnswer}`,
            topic: q.topic ?? 'General',
          };
        }

        // Short-answer / Essay: AI evaluation
        const evaluation = await this.evaluateAI(
          {
            question_text: q.question_text ?? q.question ?? '',
            options: q.options ?? [],
            correct_answer: correctAnswer,
            topic: q.topic ?? 'General',
          },
          { answer: userAnswer }
        );

        return {
          questionId: q.id,
          isCorrect: evaluation.isCorrect,
          score: evaluation.score,
          userAnswer,
          correctAnswer,
          feedback: evaluation.feedback,
          topic: evaluation.topic,
        };
      })
    );

    const totalScore   = results.reduce((s, r) => s + r.score, 0);
    const maxScore     = input.questions.reduce((s, q) => s + (q.points ?? 10), 0);
    const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const correctCount = results.filter(r => r.isCorrect).length;

    // Persist session
    let sessionId: string | undefined;
    try {
      const session = await this.store.createSession({
        exam_id:         input.examId,
        user_id:         input.userId,
        status:          'completed',
        started_at:      new Date().toISOString(),
        submitted_at:    new Date().toISOString(),
        total_questions: input.questions.length,
        correct_answers: correctCount,
        score:           totalScore,
        score_percent:   scorePercent,
        answers:         input.answers,
      });
      sessionId = session.id;
    } catch (err: any) {
      // Session save failing should not abort the response — log and continue
      logger.error('[ExamOrchestrator] Failed to save session', {
        examId: input.examId,
        error: err.message,
      });
    }

    // Mark exam completed
    await this.store.updateExamStatus(input.examId, 'completed');

    const grade =
      scorePercent >= 90 ? 'A'
      : scorePercent >= 80 ? 'B'
      : scorePercent >= 70 ? 'C'
      : scorePercent >= 60 ? 'D'
      : 'F';

    return {
      sessionId,
      score: totalScore,
      maxScore,
      scorePercent,
      correctCount,
      totalQuestions: input.questions.length,
      grade,
      results,
    };
  }

  // ── evaluateSingle ─────────────────────────────────────────────────────────

  async evaluateSingle(
    question: string,
    answer: string,
    options: string[],
    correctAnswer: string,
    topic: string
  ): Promise<AIEvaluationResult> {
    return this.evaluateAI(
      { question_text: question, options, correct_answer: correctAnswer, topic },
      { answer }
    );
  }

  // ── submit (legacy answer-list path) ──────────────────────────────────────

  async submit(input: SubmitInput): Promise<SubmitOutput> {
    // C1: fetch with userId so cache key is user-scoped (D4), then assert ownership
    const exam = await this.store.getExam(input.examId, input.userId);
    if (!exam) throw new Error('Exam not found');
    if (exam.user_id !== input.userId) throw new Error('Unauthorized: exam does not belong to this user');

    const questions = await this.store.getQuestions(input.examId);
    const qMap = new Map(questions.map(q => [q.id, q]));

    let correctCount = 0;
    const answerDetails = input.answers.map(a => {
      const q = qMap.get(a.questionId);
      const isCorrect = q ? q.correct_answer === a.selectedOption : false;
      if (isCorrect) correctCount++;
      return {
        questionId:     a.questionId,
        selectedOption: a.selectedOption,
        correctAnswer:  q?.correct_answer ?? '',
        isCorrect,
        explanation:    q?.explanation ?? '',
      };
    });

    const total      = input.answers.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed     = percentage >= 50;

    // Update active session if one exists
    const activeSession = await this.store.getActiveSession(input.examId, input.userId);
    let timeTaken = 0;
    if (activeSession) {
      timeTaken = Math.round(
        (Date.now() - new Date(activeSession.started_at).getTime()) / 1000
      );
      await this.store.updateSession(activeSession.id, {
        status:       'completed',
        completed_at: new Date().toISOString(),
        time_taken:   timeTaken,
        answers:      Object.fromEntries(
          input.answers.map(a => [a.questionId, a.selectedOption])
        ),
      });
    }

    // Save result
    await this.store.saveResult({
      exam_id:         input.examId,
      user_id:         input.userId,
      score:           correctCount * 10,
      total_questions: total,
      correct_answers: correctCount,
      percentage,
      passed,
      time_taken:      timeTaken,
      answers:         answerDetails,
      feedback:        passed ? 'Well done!' : 'Keep practicing!',
    });

    // Update user profile
    await this.store.upsertUserProfile(input.userId, {
      total_exams:    1,     // adapter merges with existing
      average_score:  percentage,
      best_score:     percentage,
      current_streak: passed ? 1 : 0,
      longest_streak: passed ? 1 : 0,
    });

    return {
      examId:           input.examId,
      userId:           input.userId,
      score:            correctCount * 10,
      percentage,
      passed,
      timeTakenSeconds: timeTaken,
      totalQuestions:   total,
      correctAnswers:   correctCount,
      answers:          answerDetails,
    };
  }

  // ── queries ────────────────────────────────────────────────────────────────

  /**
   * Fetch an exam with its questions.
   * Pass userId when the caller is authenticated so the cache key is
   * user-scoped and RLS-safe (D4 fix). Omit userId only for anonymous reads.
   */
  async getExam(id: string, userId?: string) {
    const exam = await this.store.getExam(id, userId);
    if (!exam) return null;
    const questions = await this.store.getQuestions(id);
    return { exam, questions };
  }

  async getUserExams(userId: string, page: number, limit: number): Promise<Page<ExamRow>> {
    return this.store.getUserExams(userId, page, limit);
  }

  async getHistory(
    userId: string,
    page: number,
    limit: number,
    subject?: string,
    sortBy?: string
  ) {
    return this.store.getExamHistory(userId, page, limit, subject, sortBy);
  }

  /**
   * Delete an exam. C1: asserts ownership before deletion so routes
   * cannot accidentally delete exams belonging to other users.
   */
  async deleteExam(id: string, userId: string): Promise<void> {
    const exam = await this.store.getExam(id, userId);
    if (!exam) throw new Error('Exam not found');
    if (exam.user_id !== userId) throw new Error('Unauthorized: exam does not belong to this user');
    return this.store.deleteExam(id);
  }
}
