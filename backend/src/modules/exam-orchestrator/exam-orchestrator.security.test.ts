import { ExamOrchestrator } from './index';
import { InMemoryStoreAdapter } from '@/adapters/store/in-memory.adapter';
import { fakeGenerateExam, fakeEvaluateAnswer } from '@/adapters/ai/fake-ai.adapter';

describe('ExamOrchestrator Security & Ownership Isolation', () => {
  let store: InMemoryStoreAdapter;
  let orchestrator: ExamOrchestrator;

  const userA = 'user-a-uuid';
  const userB = 'user-b-uuid';

  beforeEach(() => {
    store = new InMemoryStoreAdapter();
    orchestrator = new ExamOrchestrator(store, fakeGenerateExam, fakeEvaluateAnswer);
  });

  it('generates an exam owned by User A', async () => {
    const output = await orchestrator.generate({
      userId: userA,
      topics: 'Physics, Mechanics',
      type: 'OBJECTIVE',
      difficulty: 'medium',
      numQuestions: 2,
      timeLimit: 30,
      materials: [{ content: 'Newtonian mechanics deals with forces and motion.', mimeType: 'text/plain' }],
    });

    expect(output.exam.id).toBeDefined();
    const storedExam = await store.getExam(output.exam.id, userA);
    expect(storedExam?.user_id).toBe(userA);
  });

  it('refuses submission from User B for User A exam', async () => {
    const generated = await orchestrator.generate({
      userId: userA,
      topics: 'Biology',
      type: 'OBJECTIVE',
      difficulty: 'easy',
      numQuestions: 2,
      timeLimit: 20,
      materials: [{ content: 'Cell biology basics.', mimeType: 'text/plain' }],
    });

    const examId = generated.exam.id;
    const questions = await store.getQuestions(examId);

    // User B attempts to submit answers for User A's exam
    await expect(
      orchestrator.submit({
        examId,
        userId: userB,
        answers: [{ questionId: questions[0].id, selectedOption: 'A' }],
      })
    ).rejects.toThrow(/Unauthorized/);
  });

  it('refuses deletion from User B for User A exam', async () => {
    const generated = await orchestrator.generate({
      userId: userA,
      topics: 'Chemistry',
      type: 'OBJECTIVE',
      difficulty: 'hard',
      numQuestions: 2,
      timeLimit: 25,
      materials: [{ content: 'Organic reactions and mechanisms.', mimeType: 'text/plain' }],
    });

    const examId = generated.exam.id;

    // User B attempts to delete User A's exam
    await expect(orchestrator.deleteExam(examId, userB)).rejects.toThrow(/Unauthorized/);

    // Exam should still exist
    const stillThere = await store.getExam(examId, userA);
    expect(stillThere).not.toBeNull();
  });

  it('allows User A to successfully delete their own exam', async () => {
    const generated = await orchestrator.generate({
      userId: userA,
      topics: 'Math',
      type: 'OBJECTIVE',
      difficulty: 'medium',
      numQuestions: 2,
      timeLimit: 15,
      materials: [{ content: 'Linear algebra fundamentals.', mimeType: 'text/plain' }],
    });

    const examId = generated.exam.id;

    // User A deletes their own exam
    await orchestrator.deleteExam(examId, userA);

    // Exam should now be gone
    const deleted = await store.getExam(examId, userA);
    expect(deleted).toBeNull();
  });
});
