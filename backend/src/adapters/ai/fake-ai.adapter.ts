/**
 * FakeAIAdapter — deterministic test adapter for the AI Inference seam.
 *
 * Satisfies the same two function signatures that ExamOrchestrator injects:
 *   generateAI : (config, materials) => Promise<AIQuestion[]>
 *   evaluateAI : (question, answer)  => Promise<AIEvaluationResult>
 *
 * Design rules:
 *  - No network calls, no API keys, no timeouts.
 *  - Output is deterministic given the same numQuestions / question type.
 *  - Use it in tests: new ExamOrchestrator(store, fakeGenerate, fakeEvaluate)
 *
 * With this adapter the AI Inference seam has two concrete adapters:
 *   1. openrouter (geminiService.ts) — production
 *   2. FakeAIAdapter — tests
 * → seam is now real, not hypothetical.
 */
import type { AIExamConfig, AIMaterial, AIQuestion, AIEvaluationResult } from '@/modules/exam-orchestrator';

// ── Helpers ───────────────────────────────────────────────────────────────────

const TOPICS = ['Photosynthesis', 'Newton\'s Laws', 'Array Sorting', 'Supply & Demand', 'Cell Division'];
const SUBJECTS = ['Biology', 'Physics', 'Computer Science', 'Economics', 'Biology'];

function makeQuestion(index: number, config: AIExamConfig): AIQuestion {
  const topic   = TOPICS[index % TOPICS.length]!;
  const subject = SUBJECTS[index % SUBJECTS.length]!;

  if (config.type === 'OBJECTIVE' || config.type === 'TRUE_FALSE') {
    const options =
      config.type === 'TRUE_FALSE'
        ? ['True', 'False']
        : [
            `The correct answer about ${topic}`,
            `A plausible but wrong answer about ${topic}`,
            `Another wrong answer about ${topic}`,
            `A fourth option about ${topic}`,
          ];

    return {
      question_text:  `[FAKE Q${index + 1}] What is the primary characteristic of ${topic}?`,
      question_type:  config.type,
      options,
      correct_answer: options[0]!,
      explanation:    `The correct answer is "${options[0]}" because it accurately describes ${topic}.`,
      difficulty:     config.difficulty,
      topic,
      subject,
      order_index:    index,
      points:         config.difficulty === 'hard' ? 3 : config.difficulty === 'medium' ? 2 : 1,
    };
  }

  return {
    question_text:  `[FAKE Q${index + 1}] Explain the key principles of ${topic}.`,
    question_type:  config.type,
    options:        [],
    correct_answer: `A model answer describing the key principles of ${topic} in detail.`,
    explanation:    `A good answer should mention the core concepts of ${topic}.`,
    difficulty:     config.difficulty,
    topic,
    subject,
    order_index:    index,
    points:         config.difficulty === 'hard' ? 3 : config.difficulty === 'medium' ? 2 : 1,
  };
}

// ── Exported adapter functions ────────────────────────────────────────────────

/**
 * Deterministic exam generator — returns exactly numQuestions questions.
 * Materials are intentionally ignored (the fake doesn't need content).
 */
export async function fakeGenerateExam(
  config: AIExamConfig,
  _materials: AIMaterial[]
): Promise<AIQuestion[]> {
  return Array.from({ length: config.numQuestions }, (_, i) => makeQuestion(i, config));
}

/**
 * Deterministic evaluator:
 *  - Exact string match → isCorrect: true, score: points ?? 10
 *  - No match          → isCorrect: false, score: 0
 */
export async function fakeEvaluateAnswer(
  question: { question_text: string; options: string[]; correct_answer: string; topic: string },
  answer: { answer: string }
): Promise<AIEvaluationResult> {
  const isCorrect =
    answer.answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
  return {
    score:     isCorrect ? 10 : 0,
    feedback:  isCorrect ? '[FAKE] Correct!' : `[FAKE] Incorrect. Expected: "${question.correct_answer}"`,
    isCorrect,
    topic:     question.topic,
  };
}
