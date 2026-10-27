/**
 * SupabaseStoreAdapter — production adapter for the SomaStore seam.
 *
 * Merges the two previous ExamService implementations (supabaseService.ts
 * and examService.ts) into a single place. All Supabase calls live here.
 *
 * Inject via: new SupabaseStoreAdapter(supabaseClient)
 * Wire at startup in: src/transport/container.ts (or index.ts)
 */
import { SupabaseClient } from '@supabase/supabase-js';
import {
  SomaStore,
  ExamRow,
  QuestionRow,
  ExamResultRow,
  ExamSessionRow,
  UserProfileRow,
  Page,
} from '@/seams/soma-store';
import { DatabaseError } from '@/shared/errors';
import { sanitizeForTable, QUESTIONS_COLUMNS, EXAMS_COLUMNS, validateQuestionRow } from '@/utils/dbUtils';
import { cacheService } from '@/infrastructure/cache';
import { logger } from '@/shared/utils/logger';

export class SupabaseStoreAdapter implements SomaStore {
  constructor(private readonly db: SupabaseClient) {}

  // ── Exams ─────────────────────────────────────────────────────────────────

  async createExam(
    data: Omit<ExamRow, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ExamRow> {
    const safe = sanitizeForTable(
      { ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      EXAMS_COLUMNS
    );
    const { data: row, error } = await this.db
      .from('exams')
      .insert([safe])
      .select()
      .single();

    if (error) throw new DatabaseError(`Failed to create exam: ${error.message}`, { error });

    await cacheService.invalidateUserCache(data.user_id);
    return row as ExamRow;
  }

  async getExam(id: string, userId?: string): Promise<ExamRow | null> {
    // D4 fix: include userId in cache key so a cache hit cannot serve one
    // user's exam row to a different user (cross-user data leak bypass of RLS).
    const cacheKey = userId ? `exam:${userId}:${id}:details` : `exam:${id}:details`;
    return cacheService.cacheResponse(
      cacheKey,
      async () => {
        const { data, error } = await this.db
          .from('exams')
          .select('*')
          .eq('id', id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw new DatabaseError(`Failed to get exam: ${error.message}`, { error });
        }
        return data as ExamRow | null;
      },
      { ttl: 1800 }
    );
  }

  async getUserExams(userId: string, page: number, limit: number): Promise<Page<ExamRow>> {
    const cacheKey = `user_exams:${userId}:page_${page}:limit_${limit}`;
    return cacheService.cacheUserData(
      userId,
      cacheKey,
      async () => {
        const offset = (page - 1) * limit;
        const { data, error, count } = await this.db
          .from('exams')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw new DatabaseError(`Failed to get user exams: ${error.message}`, { error });
        return { data: (data ?? []) as ExamRow[], total: count ?? 0 };
      },
      { ttl: 900 }
    );
  }

  async updateExamStatus(
    id: string,
    status: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const updates: Record<string, any> = { status, updated_at: new Date().toISOString() };
    if (metadata) updates.metadata = metadata;

    const { error } = await this.db
      .from('exams')
      .update(updates)
      .eq('id', id);

    if (error) throw new DatabaseError(`Failed to update exam status: ${error.message}`, { error });
    await cacheService.invalidateExamCache(id);
  }

  async deleteExam(id: string): Promise<void> {
    // Delete child rows first (foreign-key constraints)
    await this.db.from('questions').delete().eq('exam_id', id);
    await this.db.from('exam_results').delete().eq('exam_id', id);
    await this.db.from('exam_attempts').delete().eq('exam_id', id);

    const { error } = await this.db.from('exams').delete().eq('id', id);
    if (error) throw new DatabaseError(`Failed to delete exam: ${error.message}`, { error });
    await cacheService.invalidateExamCache(id);
  }

  // ── Questions ─────────────────────────────────────────────────────────────

  async insertQuestions(
    rows: Omit<QuestionRow, 'id' | 'created_at'>[]
  ): Promise<QuestionRow[]> {
    const safe = rows.map((q, i) =>
      sanitizeForTable(validateQuestionRow(q as Record<string, unknown>, i), QUESTIONS_COLUMNS)
    );

    const { data, error } = await this.db
      .from('questions')
      .insert(safe)
      .select();

    if (error) throw new DatabaseError(`Failed to insert questions: ${error.message}`, { error });
    return (data ?? []) as QuestionRow[];
  }

  async getQuestions(examId: string): Promise<QuestionRow[]> {
    return cacheService.cacheExamData(
      examId,
      'questions',
      async () => {
        const { data, error } = await this.db
          .from('questions')
          .select('*')
          .eq('exam_id', examId)
          .order('order_index', { ascending: true });

        if (error) throw new DatabaseError(`Failed to get questions: ${error.message}`, { error });
        return (data ?? []) as QuestionRow[];
      },
      { ttl: 3600 }
    );
  }

  // ── Sessions ──────────────────────────────────────────────────────────────

  async createSession(data: Omit<ExamSessionRow, 'id'>): Promise<ExamSessionRow> {
    const { data: row, error } = await this.db
      .from('exam_sessions')
      .insert(data)
      .select()
      .single();

    if (error) throw new DatabaseError(`Failed to create session: ${error.message}`, { error });
    return row as ExamSessionRow;
  }

  async getActiveSession(examId: string, userId: string): Promise<ExamSessionRow | null> {
    const { data, error } = await this.db
      .from('exam_sessions')
      .select('*')
      .eq('exam_id', examId)
      .eq('user_id', userId)
      .eq('status', 'in_progress')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new DatabaseError(`Failed to get active session: ${error.message}`, { error });
    }
    return data as ExamSessionRow | null;
  }

  async updateSession(id: string, updates: Partial<ExamSessionRow>): Promise<void> {
    const { error } = await this.db
      .from('exam_sessions')
      .update(updates)
      .eq('id', id);

    if (error) throw new DatabaseError(`Failed to update session: ${error.message}`, { error });
  }

  // ── Results ───────────────────────────────────────────────────────────────

  async saveResult(
    data: Omit<ExamResultRow, 'id' | 'created_at'>
  ): Promise<ExamResultRow> {
    const { data: row, error } = await this.db
      .from('exam_results')
      .insert([{ ...data, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new DatabaseError(`Failed to save result: ${error.message}`, { error });
    return row as ExamResultRow;
  }

  async getExamHistory(
    userId: string,
    page: number,
    limit: number,
    subject?: string,
    sortBy = 'created_at'
  ): Promise<Page<ExamResultRow & { exam?: Partial<ExamRow> }>> {
    const cacheKey = `exam:history:${userId}:${page}:${limit}:${subject ?? 'all'}:${sortBy}`;

    return cacheService.cacheResponse(cacheKey, async () => {
      const offset = (page - 1) * limit;

      let query = this.db
        .from('exam_results')
        .select('*, exams!inner(title, subject, type, difficulty)', { count: 'exact' })
        .eq('user_id', userId)
        .order(sortBy === 'created_at' ? 'created_at' : sortBy, { ascending: false })
        .range(offset, offset + limit - 1);

      if (subject) {
        query = query.ilike('exams.title', `%${subject}%`);
      }

      const { data, error, count } = await query;
      if (error) throw new DatabaseError(`Failed to get exam history: ${error.message}`, { error });

      return {
        data: (data ?? []) as Array<ExamResultRow & { exam?: Partial<ExamRow> }>,
        total: count ?? 0,
      };
    }, { ttl: 300 });
  }

  // ── User profiles ─────────────────────────────────────────────────────────

  async upsertUserProfile(userId: string, updates: Partial<UserProfileRow>): Promise<void> {
    const { data: existing } = await this.db
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existing) {
      const { error } = await this.db
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId);
      if (error) logger.error('Failed to update user profile', { userId, error: error.message });
    } else {
      const { error } = await this.db
        .from('user_profiles')
        .upsert({ id: userId, ...updates });
      if (error) logger.error('Failed to upsert user profile', { userId, error: error.message });
    }
  }
}
