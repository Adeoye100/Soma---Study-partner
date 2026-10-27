/**
 * InMemoryStoreAdapter — deterministic test adapter for the SomaStore seam.
 *
 * Backed by plain Maps. Zero network, zero Supabase dependency.
 * Use in Jest tests by injecting wherever a SomaStore is expected:
 *
 *   const store = new InMemoryStoreAdapter();
 *   const orchestrator = new ExamOrchestrator(store, fakeAI);
 *
 * The adapter is intentionally simple — it mirrors the seam contract exactly.
 * Don't add test-only helper methods here; keep it to what SomaStore requires.
 */
import {
  SomaStore,
  ExamRow,
  QuestionRow,
  ExamResultRow,
  ExamSessionRow,
  UserProfileRow,
  Page,
} from '@/seams/soma-store';

let _idCounter = 0;
const nextId = (): string => `mem-${++_idCounter}`;
const now = (): string => new Date().toISOString();

export class InMemoryStoreAdapter implements SomaStore {
  public readonly exams      = new Map<string, ExamRow>();
  public readonly questions  = new Map<string, QuestionRow>();   // keyed by question id
  public readonly results    = new Map<string, ExamResultRow>();
  public readonly sessions   = new Map<string, ExamSessionRow>();
  public readonly profiles   = new Map<string, UserProfileRow>();

  /** Reset all state. Call in beforeEach. */
  reset(): void {
    this.exams.clear();
    this.questions.clear();
    this.results.clear();
    this.sessions.clear();
    this.profiles.clear();
    _idCounter = 0;
  }

  // ── Exams ─────────────────────────────────────────────────────────────────

  async createExam(
    data: Omit<ExamRow, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ExamRow> {
    const row: ExamRow = { ...data as any, id: nextId(), created_at: now(), updated_at: now() };
    this.exams.set(row.id, row);
    return row;
  }

  async getExam(id: string, _userId?: string): Promise<ExamRow | null> {
    return this.exams.get(id) ?? null;
  }

  async getUserExams(userId: string, page: number, limit: number): Promise<Page<ExamRow>> {
    const all = [...this.exams.values()].filter(e => e.user_id === userId);
    const offset = (page - 1) * limit;
    return { data: all.slice(offset, offset + limit), total: all.length };
  }

  async updateExamStatus(
    id: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const row = this.exams.get(id);
    if (!row) return;
    this.exams.set(id, { ...row, status, ...(metadata ? { metadata } : {}), updated_at: now() });
  }

  async deleteExam(id: string): Promise<void> {
    this.exams.delete(id);
    for (const [qid, q] of this.questions) {
      if (q.exam_id === id) this.questions.delete(qid);
    }
    for (const [rid, r] of this.results) {
      if (r.exam_id === id) this.results.delete(rid);
    }
  }

  // ── Questions ─────────────────────────────────────────────────────────────

  async insertQuestions(
    rows: Omit<QuestionRow, 'id' | 'created_at'>[]
  ): Promise<QuestionRow[]> {
    return rows.map(r => {
      const row: QuestionRow = { ...r as any, id: nextId(), created_at: now() };
      this.questions.set(row.id, row);
      return row;
    });
  }

  async getQuestions(examId: string): Promise<QuestionRow[]> {
    return [...this.questions.values()]
      .filter(q => q.exam_id === examId)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }

  // ── Sessions ──────────────────────────────────────────────────────────────

  async createSession(data: Omit<ExamSessionRow, 'id'>): Promise<ExamSessionRow> {
    const row: ExamSessionRow = { ...data, id: nextId() };
    this.sessions.set(row.id, row);
    return row;
  }

  async getActiveSession(examId: string, userId: string): Promise<ExamSessionRow | null> {
    return (
      [...this.sessions.values()].find(
        s => s.exam_id === examId && s.user_id === userId && s.status === 'in_progress'
      ) ?? null
    );
  }

  async updateSession(id: string, updates: Partial<ExamSessionRow>): Promise<void> {
    const row = this.sessions.get(id);
    if (row) this.sessions.set(id, { ...row, ...updates });
  }

  // ── Results ───────────────────────────────────────────────────────────────

  async saveResult(
    data: Omit<ExamResultRow, 'id' | 'created_at'>
  ): Promise<ExamResultRow> {
    const row: ExamResultRow = { ...data, id: nextId(), created_at: now() };
    this.results.set(row.id, row);
    return row;
  }

  async getExamHistory(
    userId: string,
    page: number,
    limit: number,
    _subject?: string,
    _sortBy = 'created_at'
  ): Promise<Page<ExamResultRow & { exam?: Partial<ExamRow> }>> {
    const all = [...this.results.values()]
      .filter(r => r.user_id === userId)
      .map(r => ({ ...r, exam: this.exams.get(r.exam_id) }));

    const offset = (page - 1) * limit;
    return { data: all.slice(offset, offset + limit), total: all.length };
  }

  // ── User profiles ─────────────────────────────────────────────────────────

  async upsertUserProfile(userId: string, updates: Partial<UserProfileRow>): Promise<void> {
    const existing = this.profiles.get(userId);
    this.profiles.set(userId, { ...(existing ?? { id: userId } as UserProfileRow), ...updates });
  }
}
