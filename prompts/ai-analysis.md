# AI Article Analysis Pipeline Implementation Plan

## Goal
Implement the AI Article Analysis Pipeline using Vercel AI SDK configured with OpenRouter, Supabase persistence, Zod schema validation, batching, error recovery, and detailed run logging.

---

## Skills Read
- `.agents/skills/supabase`: Database schema, typed clients, `saveArticleAnalysis`, `getPendingArticlesForAnalysis`, `insertLog`, and security rules.
- `.agents/skills/ai-sdk`: Vercel AI SDK integration, `generateObject`, provider setup, structured JSON output generation, and Zod schemas.

---

## Existing Code Inspected
- `AGENTS.md`: Sections 1, 4, 5, 6, 7, 14, 15, 17, 19, 21, 22.
- `lib/supabase/types.ts`: `Article`, `ArticleAnalysis`, `SentimentLabel`, `PoliticalBiasLabel`, `ArticleAnalysisInsert`.
- `lib/supabase/db.ts`: `getPendingArticlesForAnalysis`, `saveArticleAnalysis`, `insertLog`.
- `package.json`: Current dependencies (`@supabase/supabase-js`, Next.js 16, React 19).

---

## Decisions & Assumptions
1. **AI Provider & SDK**: Use `ai`, `@ai-sdk/openai`, and `zod`. Configure `@ai-sdk/openai`'s `createOpenAI` with `baseURL: 'https://openrouter.ai/api/v1'` and `apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY`. Default model will be `google/gemini-2.5-flash` (or configurable via `ANALYSIS_MODEL` env var).
2. **Pending Articles Selection**: Use `getPendingArticlesForAnalysis(limit)` from `lib/supabase/db.ts`, which LEFT JOINs `articles` to `article_analyses` and filters for missing analysis rows (not relying on `analyzed_at` alone).
3. **Batching**: Process articles in batches (configurable via `ANALYSIS_BATCH_SIZE`, defaulting to 5) to prevent API timeouts.
4. **Validation & Normalization**:
   - Validate AI response via Zod `generateObject` schema.
   - Enforce `left_percentage + center_percentage + right_percentage === 100` (auto-normalize if minor rounding offset occurs).
   - Derive `bias_score` strictly as `(right_percentage - left_percentage) / 100`.
   - Re-try once on validation failure before marking an article as failed.
5. **Persistence**:
   - Save analysis to `article_analyses` table using `saveArticleAnalysis`.
   - Update `analyzed_at` timestamp on `articles` table only AFTER successful analysis insert.
6. **API Route**:
   - Route path: `POST /api/analyze`
   - Requires header: `x-biasly-admin-secret` matching `BIASLY_ADMIN_SECRET`. Returns `401` if invalid/missing.
   - Accepts optional JSON body parameters: `{ limit?: number, articleIds?: string[] }`.

---

## Files Likely to Change / Be Created
- [NEW] `lib/ai/config.ts`: OpenRouter provider setup using AI SDK.
- [NEW] `lib/ai/analysis.ts`: Core AI analysis service function (`analyzeArticleText`), prompt engineering, Zod schemas, normalization, retry logic, and batch orchestrator (`runAnalysisPipeline`).
- [NEW] `app/api/analyze/route.ts`: API route handler (`POST /api/analyze`) with secret validation, request parsing, and response summary output.
- [MODIFY] `package.json`: Add `ai`, `@ai-sdk/openai`, `zod` dependencies.

---

## Implementation Requirements

1. **OpenRouter Provider (`lib/ai/config.ts`)**:
   - Use `createOpenAI` from `@ai-sdk/openai`.
   - Set `baseURL: 'https://openrouter.ai/api/v1'` and `apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY`.
   - Export standard analysis model provider reference.

2. **Analysis Service (`lib/ai/analysis.ts`)**:
   - Define Zod schema for structured output matching section 19 of `AGENTS.md`:
     - `summary`: concise, neutral summary of the article content.
     - `sentimentScore`: number from -1.0 to 1.0.
     - `sentimentLabel`: `'positive' | 'neutral' | 'negative'`.
     - `politicalFramingLabel`: `'left' | 'center' | 'right' | 'mixed' | 'unclear'`.
     - `leftPercentage`: number 0 to 100.
     - `centerPercentage`: number 0 to 100.
     - `rightPercentage`: number 0 to 100.
     - `confidence`: number 0 to 1.
     - `framingNotes`: array of string explanations/insights regarding article framing.
     - `loadedTerms`: array of objects `{ term: string, explanation: string, biasTarget?: string }`.
     - `disclaimer`: standard AI disclaimer.
   - Prompt design explicitly instructing the model:
     - Political framing is AI-estimated based strictly on text evidence.
     - Do not infer bias based solely on news source brand.
     - `leftPercentage + centerPercentage + rightPercentage` MUST equal 100.
   - Percentage normalization function: if sum != 100, dynamically adjust percentages proportionally so sum is exactly 100.
   - Retry logic: If `generateObject` fails or output is invalid, retry once.
   - `analyzeArticle(article: Article)` function returning `ArticleAnalysisInsert`.
   - `runAnalysisPipeline(options)` orchestrator:
     - Fetch pending articles from Supabase.
     - Batch process in chunks of `ANALYSIS_BATCH_SIZE` (default 5).
     - Log neat server-side console outputs and save execution progress into `logs` via `insertLog`.
     - Return detailed summary object containing `status`, `total_pending`, `analyzed`, `skipped`, `failed`, `duration_ms`, and `errors`.

3. **API Route Handler (`app/api/analyze/route.ts`)**:
   - Method: `POST`.
   - Verify `x-biasly-admin-secret` request header against `process.env.BIASLY_ADMIN_SECRET`.
   - Return `401 Unauthorized` if secret is missing or invalid.
   - Execute `runAnalysisPipeline`.
   - Return JSON summary response with status code `200` (or `500` on fatal error).

---

## Security Requirements
- Keep `OPENROUTER_API_KEY` / `OPENAI_API_KEY` and `BIASLY_ADMIN_SECRET` strictly server-side. Never expose them to client/browser code.
- Require `x-biasly-admin-secret` header for `POST /api/analyze`.

---

## Acceptance Criteria
- `POST /api/analyze` authenticates request via `x-biasly-admin-secret`.
- Pending articles (without matching `article_analyses` row) are retrieved using LEFT JOIN query.
- Articles are analyzed via OpenRouter using Vercel AI SDK `generateObject`.
- Percentages sum to 100, `bias_score` is correctly derived as `(right_percentage - left_percentage) / 100`.
- Analysis is saved to `article_analyses` table and `analyzed_at` timestamp is set on `articles`.
- Neat console progress is logged and stored in `logs` table.
- Final summary object is returned in API response.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`

---

## Manual Verification & Test Steps
1. Ensure `.env.local` contains `OPENROUTER_API_KEY` (or `OPENAI_API_KEY`), `BIASLY_ADMIN_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.
2. Start the dev server: `npm run dev`.
3. Open a terminal and run manual test curl:
   ```bash
   curl -X POST http://localhost:3000/api/analyze \
     -H "Content-Type: application/json" \
     -H "x-biasly-admin-secret: YOUR_ADMIN_SECRET" \
     -d '{"limit": 2}'
   ```
4. Watch Next.js server logs for batch analysis progress output.
5. Verify response JSON contains pipeline run summary (`status`, `analyzed`, `failed`, `total_pending`).
6. Query Supabase database to verify `article_analyses` rows exist and matching `articles.analyzed_at` timestamp is populated.
