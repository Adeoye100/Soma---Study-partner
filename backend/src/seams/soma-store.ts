/**
 * SomaStore — the single persistence seam for the Soma backend.
 *
 * This interface is everything the application layer needs to know about
 * storage. Concrete adapters (SupabaseStore, InMemoryStore) satisfy it.
 *
 * Rules:
 *  - Two adapters exist → the seam is real, not hypothetical.
 *  - No adapter is instantiated here; they are injected at the composition root.
 *  - Add methods here only when a second call site genuinely needs them.
 *
 * Adapters:
 *  - adapters/store/supabase.adapter.ts  — production (Supabase Postgres)
 *  - adapters/store/in-memory.adapter.ts — deterministic test fake (Map-backed)
 */

// ── Shared row shapes ─────────────────────────────────────────────────────────

export interface ExamRow {
  id: string;
  title: string;
  description?: string;
  type: 'OBJECTIVE' | 'SHORT_ANSWER' | 'ESSAY' | 'TRUE_FALSE';
  difficulty: 'easy' | 'medium' | 'hard';
  num_questions: number;
  time_limit?: number;
  user_id: string;
  status?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface QuestionRow {
  id: string;
  exam_id: string;
  user_id: string;
  question_text: string;
  question_type: 'OBJECTIVE' | 'SHORT_ANSWER' | 'ESSAY' | 'TRUE_FALSE';
  options: string[];
  correct_answer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  subject?: string;
  order_index?: number;
  points?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ExamResultRow {
  id: string;
  exam_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  passed: boolean;
  time_taken?: number;
  answers: any[];
  feedback?: string;
  created_at: string;
}

export interface ExamSessionRow {
  id: string;
  exam_id: string;
  user_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  time_taken?: number;
  current_question_index?: number;
  answers?: Record<string, string>;
  score?: number;
  score_percent?: number;
  total_questions?: number;
  correct_answers?: number;
  submitted_at?: string;
}

export interface UserProfileRow {
  id: string;
  total_exams: number;
  average_score: number;
  best_score: number;
  current_streak: number;
  longest_streak: number;
  updated_at?: string;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface Page<T> {
  data: T[];
  total: number;
}

// ── SomaStore interface ───────────────────────────────────────────────────────

export interface SomaStore {
  // ── Exams ──────────────────────────────────────────────────────────────────

  createExam(data: Omit<ExamRow, 'id' | 'created_at' | 'updated_at'>): Promise<ExamRow>;

  getExam(id: string, userId?: string): Promise<ExamRow | null>;

  getUserExams(userId: string, page: number, limit: number): Promise<Page<ExamRow>>;

  updateExamStatus(
    id: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void>;

  deleteExam(id: string): Promise<void>;

  // ── Questions ──────────────────────────────────────────────────────────────

  insertQuestions(
    rows: Omit<QuestionRow, 'id' | 'created_at'>[]
  ): Promise<QuestionRow[]>;

  getQuestions(examId: string): Promise<QuestionRow[]>;

  // ── Exam sessions & results ────────────────────────────────────────────────

  createSession(
    data: Omit<ExamSessionRow, 'id'>
  ): Promise<ExamSessionRow>;

  getActiveSession(examId: string, userId: string): Promise<ExamSessionRow | null>;

  updateSession(
    id: string,
    updates: Partial<ExamSessionRow>
  ): Promise<void>;

  saveResult(
    data: Omit<ExamResultRow, 'id' | 'created_at'>
  ): Promise<ExamResultRow>;

  getExamHistory(
    userId: string,
    page: number,
    limit: number,
    subject?: string,
    sortBy?: string
  ): Promise<Page<ExamResultRow & { exam?: Partial<ExamRow> }>>;

  // ── User profiles ──────────────────────────────────────────────────────────

  upsertUserProfile(
    userId: string,
    updates: Partial<UserProfileRow>
  ): Promise<void>;
}
