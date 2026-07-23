# Supabase Database & Data Access Implementation Prompt

## Goal
Implement Supabase database schema, TypeScript types, client instances, and data access functions for **biasly** / **PERSPECTIVE** news analysis platform according to `AGENTS.md` section 7 and the `@.agents/skills/supabase` skill. This establishes Supabase as the single source of truth for news sources, scraped articles, AI analyses, execution logs, and Oxylabs scheduler tracking.

## Skills Read
- `.agents/skills/supabase`
- `.agents/skills/supabase-postgres-best-practices`

## Existing Code Inspected
- `AGENTS.md` (Section 7: Supabase source of truth, Section 9: Candidate URL chunking rule, Section 19: Pending analysis check)
- `.env.local` (Contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABAE_SERVICE_ROLE_KEY`)
- `package.json` (Next.js 16.2.10, React 19.2.4)

## Decisions & Assumptions
- Install `@supabase/supabase-js` as the core database client library.
- Environment variables: Support both `SUPABASE_SERVICE_ROLE_KEY` and `SUPABAE_SERVICE_ROLE_KEY` (handling typo gracefully while adding standard name to `.env.local`).
- Database Schema (`supabase/schema.sql`):
  1. `sources`: Stores news source metadata (`id`, `name`, `listing_url`, `parser_strategy`, `active`, `logo_url`, `created_at`, `updated_at`). Includes seed data for major active sources (e.g. Reuters, NPR, Fox News, BBC News, The Guardian).
  2. `articles`: Stores scraped articles (`id`, `source_id`, `original_url` UNIQUE, `canonical_url`, `title`, `image_url`, `published_date`, `raw_text`, `scraped_at`, `analyzed_at`).
  3. `article_analyses`: Stores AI analysis results (`id`, `article_id` UNIQUE, `summary`, `sentiment_score`, `sentiment_label`, `bias_score`, `bias_label`, `left_percentage`, `center_percentage`, `right_percentage`, `confidence`, `framing_notes`, `loaded_terms`, `disclaimer`, `model`, `created_at`). Note: `embedding vector(1536)` is excluded for now, reserved for Section 20.
  4. `logs`: Stores structured execution logs (`id`, `level`, `message`, `details`, `created_at`).
  5. `oxylabs_schedules`: Stores Oxylabs scheduler configurations (`id`, `source_id`, `schedule_id` UNIQUE string for 64-bit precision, `status`, `cron`, `created_at`, `updated_at`).
  6. `oxylabs_schedule_runs`: Stores Oxylabs job execution runs (`id`, `schedule_id`, `job_id` string, `status`, `articles_scraped`, `started_at`, `completed_at`, `error_message`).
- Row Level Security (RLS) & Security:
  - RLS enabled on all core tables.
  - Public `SELECT` policy for `sources`, `articles`, and `article_analyses` for `anon` and `authenticated` roles.
  - Admin/pipeline operations use service-role key which bypasses RLS safely on the server side.
- Client Architecture:
  - `lib/supabase/types.ts`: Comprehensive TypeScript interfaces matching all tables, inserts, and updates.
  - `lib/supabase/client.ts`: Exports `createClient()` (browser/anon client) and `createAdminClient()` (server service role client).
  - `lib/supabase/db.ts`: Data access layer with utility methods:
    - `getActiveSources()`: Fetches all active news sources.
    - `checkUrlsExist(urls: string[])`: Safely checks original URLs against database in chunks of max 15 URLs per `.in()` query (conforming to Section 9 URL existence check).
    - `insertArticles(articles)`: Inserts new scraped articles, ignoring duplicate `original_url` collisions.
    - `getPendingArticlesForAnalysis()`: Uses LEFT JOIN on `articles` and `article_analyses` where `article_analyses.id IS NULL` (conforming to Section 19 pending-analysis check).
    - `saveArticleAnalysis(analysis)`: Inserts AI analysis and updates `analyzed_at` on the target article.
    - `insertLog(level, message, details)` & `getLogs(limit)`: Centralized system log tracking.
    - `getSchedules()`, `upsertSchedule()`, `recordScheduleRun()`: Oxylabs scheduler helpers.
- Read API Endpoints:
  - `GET /api/sources`: Returns active sources.
  - `GET /api/logs`: Returns recent execution logs.

## Files Likely to Change
- `package.json` [MODIFY] (Add `@supabase/supabase-js` dependency)
- `.env.local` [MODIFY] (Add `SUPABASE_SERVICE_ROLE_KEY` alias)
- `supabase/schema.sql` [NEW] (Full SQL schema with table definitions, constraints, indexes, RLS, and initial seed sources)
- `lib/supabase/types.ts` [NEW] (TypeScript database types and table models)
- `lib/supabase/client.ts` [NEW] (Supabase browser client and admin service role client)
- `lib/supabase/db.ts` [NEW] (Data access helper layer for sources, articles, analyses, logs, and schedules)
- `app/api/sources/route.ts` [NEW] (GET API route to list active sources)
- `app/api/logs/route.ts` [NEW] (GET API route to retrieve recent system logs)

## Implementation Requirements
1. Install `@supabase/supabase-js`.
2. Create `supabase/schema.sql` with complete SQL table definitions, foreign keys, unique constraints on `original_url` and `schedule_id`, performance indexes, RLS policies, and default active news sources seed data.
3. Define strict TypeScript interfaces in `lib/supabase/types.ts` representing `Database`, `Source`, `Article`, `ArticleAnalysis`, `Log`, `OxylabsSchedule`, and `OxylabsScheduleRun`.
4. Create `lib/supabase/client.ts` delivering safe browser client and service role admin client factory.
5. Create `lib/supabase/db.ts` containing all CRUD and query helper functions required by scraping, AI analysis, logging, and scheduling pipelines.
6. Ensure candidate URL deduplication uses max 15 URLs per batch in `.in()` filter.
7. Ensure pending analysis queries use a LEFT JOIN to check missing `article_analyses` rows rather than `analyzed_at IS NULL` alone.
8. Create `GET /api/sources` and `GET /api/logs` API endpoints returning JSON data.
9. Verify clean build with `npm run build` and `npm run lint`.

## Security Requirements
- Keep `SUPABASE_SERVICE_ROLE_KEY` strictly on the server side (`lib/supabase/client.ts` server initialization). Never expose service role keys to client components or `NEXT_PUBLIC_` prefixed environment variables.
- Enable RLS on all public schema tables in `supabase/schema.sql`.
- Grant explicit public SELECT access to `anon` and `authenticated` roles for read-only tables (`sources`, `articles`, `article_analyses`).

## Acceptance Criteria
- Database schema file `supabase/schema.sql` is ready to execute in Supabase SQL Editor.
- `@supabase/supabase-js` is installed.
- Supabase clients and helper functions compile cleanly without TypeScript errors.
- Data access functions support chunked URL deduplication and LEFT JOIN pending article lookup.
- `GET /api/sources` returns active news sources from database.
- `GET /api/logs` returns log records from database.
- Project passes `npm run build` and `npm run lint`.

## Checks to Run
- `npm run build`
- `npm run lint`

## Exact Manual Test Steps Expected After Implementation
1. Copy contents of `supabase/schema.sql` and run it in the Supabase Dashboard -> SQL Editor for project `qlzbyuvzrkcqsabfksxl`.
2. Verify tables `sources`, `articles`, `article_analyses`, `logs`, `oxylabs_schedules`, and `oxylabs_schedule_runs` are created with RLS enabled.
3. Run dev server: `npm run dev`.
4. Test source list API: `curl -X GET http://localhost:3000/api/sources`. Verify it returns the seeded active sources.
5. Test logs API: `curl -X GET http://localhost:3000/api/logs`. Verify it returns an empty or logged array.
