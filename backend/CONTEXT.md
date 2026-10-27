# Soma Backend — Domain Vocabulary

> Created during architecture review, 2026-10-12.  
> Product name: **Soma** (the frontend commit "Somma" was a typo, reverted).

## Domain Terms

**Exam**  
A generated set of Questions for one learner. Has `type` (OBJECTIVE · SHORT_ANSWER · ESSAY · TRUE_FALSE), `difficulty` (easy · medium · hard), and an optional `time_limit`. Status lifecycle: `draft` → `processing` → `completed` / `failed`.

**Question**  
One prompt belonging to an Exam. Fields: `question_text`, `options[]`, `correct_answer`, `explanation`, `topic`, `points`.

**Material**  
Source content uploaded by a learner — the clean text extracted from a document (PDF, DOCX, PPTX, image, plain text). Used as context for AI Exam generation.

**Document Extraction**  
The process of turning an uploaded file (bytes) into clean Material text. Current live path: `documents-free.ts` → `FreeOcrService` (pdf-parse v1 · tesseract.js · mammoth). Unmounted premium path: `documents.ts` (google-vision · officeDocumentService).

**Exam Session**  
One learner's attempt at an Exam. States: `in_progress` · `completed` · `abandoned`. Holds per-question answers and current position.

**Evaluation**  
Scoring one answer. Returns `score`, `feedback`, `isCorrect`, `topic`. Objective/True-False: deterministic string compare. Short-answer/Essay: AI-graded via OpenRouter.

**Result**  
The stored outcome of a completed Session: `score`, `percentage`, `passed`, `time_taken`, `answers[]`.

**User Profile**  
Aggregate learner stats: `total_exams`, `average_score`, `best_score`, `current_streak`, `longest_streak`.

**Exam Orchestrator**  
The deep module (`modules/exam-orchestrator/index.ts`) that owns the Exam lifecycle: `generate` → `evaluate` → `submit` + 4 queries. Accepts injected `SomaStore`, `generateAI`, `evaluateAI` collaborators. _Not yet mounted._

**Soma Store**  
The persistence seam (`seams/soma-store.ts`). Two adapters: `SupabaseStoreAdapter` (production, Supabase Postgres + RLS) and `InMemoryStoreAdapter` (deterministic test fake, Map-backed). _Not yet wired._

**AI Inference**  
Calling the OpenRouter API (model: `google/gemini-2.0-flash-001` by default) for Exam generation and written-answer Evaluation. Currently lives in `services/geminiService.ts` (747 LOC). Key rotation and exponential-backoff retry are internal to that module.

**Proctoring Session**  
Webcam monitoring during an Exam. The frontend sends frames every 2 s to the Python proctoring service at `http://localhost:8000/api/proctoring/analyze-frame`.

**Violation**  
A detected proctoring event: `NO_FACE` or `MULTIPLE_FACES`. The frontend also POSTs `POST /api/proctoring/log-violation` to the Node backend — **no handler exists for this endpoint**.

## Seams recorded as decisions

| Seam | Interface file | Adapters | Status |
|---|---|---|---|
| AuthAdapter | `src/services/authService.ts` | SupabaseAuthAdapter (prod) · DevInMemoryAuthAdapter (dev/test) | **Active & Wired** (2 adapters) |
| SomaStore | `src/seams/soma-store.ts` | SupabaseStoreAdapter · InMemoryStoreAdapter | Created, not wired |
| AI Inference | (to be formalised) | geminiService (prod) · fake (needed) | Hypothetical seam (1 adapter) |

## Open questions

- Is the automation subsystem (`src/automation/`, 18 567 LOC) live, deferred, or abandoned? The route is unmounted and the feature has zero hot-spot commits.
- Which Python service is canonical for proctoring: `app.py` (real OpenCV) or `main.py` (placeholder deployed by Procfile)?
- Is `multer@1.4.5-lts.1` pinned intentionally (security override) or accidentally left from before multer v2?
