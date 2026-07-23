# Oxylabs Scraping Pipeline Implementation Prompt

## Goal
Implement the production Oxylabs scraping pipeline for **biasly** according to `AGENTS.md` (Sections 8–16) and skills `@.agents/skills/oxylabs-web-scraper` and `@.agents/skills/supabase`. The pipeline fetches active news source homepages live via Oxylabs, extracts visible candidate article links, filters out non-article pages, checks candidate URLs against Supabase in chunks of max 15, scrapes detail pages via Oxylabs, cleans and validates article content (title, image URL, published date, raw text quality), and saves valid articles append-only to Supabase while logging execution progress.

## Skills Read
- `.agents/skills/oxylabs-web-scraper`
- `.agents/skills/supabase`

## Existing Code Inspected
- `AGENTS.md` (Section 8: Source Selection, Section 9: Scraping Model & Rules, Section 10: Storage Rules, Section 11: Link Extraction, Section 12: Candidate Filtering, Section 13: Validation & Cleanup, Section 14: API Route Methods, Section 15: Admin Secret, Section 16: Manual Scraping Behavior)
- `lib/supabase/db.ts` (`getActiveSources`, `checkUrlsExist`, `insertArticles`, `insertLog`)
- `lib/supabase/types.ts` (`Source`, `Article`, `ArticleInsert`, `Log`)
- `.env.local` (Contains `OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, `BIASLY_ADMIN_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABAE_SERVICE_ROLE_KEY`)
- `package.json`

## Decisions & Assumptions
- Dependency: Install `cheerio` for HTML parsing and DOM traversal.
- Oxylabs Integration (`lib/scraping/oxylabs.ts`):
  - Uses HTTP Basic Auth (`OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`).
  - Calls `POST https://realtime.oxylabs.io/v1/queries` with payload `{ source: "universal", url: targetUrl }`.
- Link Extraction & Filtering (`lib/scraping/extractors.ts`):
  - Extract links from visible story cards on source homepages (Reuters, NPR, Fox News, BBC News, The Guardian).
  - Apply Non-Article Reject List: reject category, section, topic, tag, author, search, navigation, footer, show, program, podcast, live, game, product, review, corporate, support, newsletter, and video-only URLs.
  - Apply Source-Specific Candidate Patterns (prefer long story slugs, article IDs, date paths; reject listing/category patterns like `/world/africa`, `/sections/politics`).
- Deduplication (`lib/supabase/db.ts`):
  - Use `checkUrlsExist` querying Supabase `articles` table in chunks of max 15 candidate URLs per `.in()` query (conforming to Section 9 URL existence check).
- Detail Page Parsing & Validation (`lib/scraping/cleaner.ts`):
  - Extract canonical URL, title, meta image / lead image URL, published date (`<meta property="article:published_time">`, `<time datetime="...">`, JSON-LD), and main article body.
  - Content Gate: Must have article-specific URL, article title, published date, image URL, and body text.
  - Body quality: Must pass either >= 3 paragraphs OR >= 900 clean characters. Split single large text blocks by DOM blocks or sentence boundaries.
  - Cleanup `raw_text`: Remove scripts, styles, ad placeholders, newsletter/subscription blocks, related content, social share text, navigation headers/footers, JS errors, CSS dumps.
- Pipeline Orchestrator (`lib/scraping/pipeline.ts`):
  - Orchestrates the full canonical scrape-to-insert flow per source.
  - Emits real-time server-side console logs.
  - Inserts valid articles into Supabase (`insertArticles`).
  - Records execution summary in Supabase `logs` table via `insertLog`.
  - Returns run logging summary object containing: status, sources checked, candidates found, candidates rejected, duplicates skipped, detail pages scraped, articles inserted, articles rejected, articles failed, total duration, and rejection reasons grouped by count.
- API Route (`app/api/scrape/route.ts`):
  - `POST /api/scrape`
  - Validates `x-biasly-admin-secret` request header against `BIASLY_ADMIN_SECRET`. Returns `401 Unauthorized` if missing/invalid.
  - Accepts optional JSON body: `{ sourceIds?: string[], limitPerSource?: number }`.

## Files Likely to Change
- `package.json` [MODIFY] (Add `cheerio` dependency)
- `lib/scraping/oxylabs.ts` [NEW] (Oxylabs Realtime API client with Basic Auth)
- `lib/scraping/extractors.ts` [NEW] (Homepage card link extractor, non-article filter, candidate URL validator)
- `lib/scraping/cleaner.ts` [NEW] (Article detail HTML parser, metadata extractor, DOM cleaner, and content gate)
- `lib/scraping/pipeline.ts` [NEW] (Scrape-to-insert pipeline coordinator, console logger, DB writer, and summary generator)
- `app/api/scrape/route.ts` [NEW] (POST API endpoint protected by `x-biasly-admin-secret`)

## Implementation Requirements
1. Install `cheerio`.
2. Implement Oxylabs API client in `lib/scraping/oxylabs.ts` with error handling for 400, 401, 429, 500 responses.
3. Implement link extraction in `lib/scraping/extractors.ts` with canonical non-article reject list and source-specific article candidate rules.
4. Implement detail parsing & cleaning in `lib/scraping/cleaner.ts` enforcing the article content gate (title, image URL, published date, raw text quality).
5. Implement pipeline orchestrator in `lib/scraping/pipeline.ts` executing the 9-step scrape-to-insert flow.
6. Enforce max 15 candidate URLs per `.in()` chunk query during DB deduplication.
7. Create `POST /api/scrape` route in `app/api/scrape/route.ts` requiring `x-biasly-admin-secret` header.
8. Log detailed progress to server console and record final summary to Supabase `logs` table.
9. Ensure project builds cleanly with `npm run build` and passes `npm run lint`.

## Security Requirements
- Keep Oxylabs credentials (`OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`) and admin secret (`BIASLY_ADMIN_SECRET`) strictly on the server.
- Protect `POST /api/scrape` with `x-biasly-admin-secret` header check. Reject unauthorized requests with 401.

## Acceptance Criteria
- Active sources are retrieved from Supabase (`sources` table).
- Candidate links are extracted from homepages, filtered against the non-article reject list, and candidate URLs checked against Supabase in chunks of max 15.
- Detail pages are scraped via Oxylabs and parsed.
- Invalid articles missing published date, image URL, or adequate text are rejected with reason counts logged.
- Valid articles are saved to Supabase `articles` table (append-only, unique `original_url`).
- Detailed summary log is returned by `POST /api/scrape` and saved to `logs` table.
- `npm run build` and `npm run lint` succeed without errors.

## Checks to Run
- `npm run build`
- `npm run lint`

## Exact Manual Test Steps Expected After Implementation
1. Ensure `.env.local` contains `OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, and `BIASLY_ADMIN_SECRET`.
2. Start Next.js dev server: `npm run dev`.
3. Test secret rejection (should return 401):
   `curl -X POST http://localhost:3000/api/scrape`
4. Test manual scrape trigger (e.g. limit 2 articles per source):
   `curl -X POST http://localhost:3000/api/scrape -H "x-biasly-admin-secret: <BIASLY_ADMIN_SECRET>" -H "Content-Type: application/json" -d "{\"limitPerSource\": 2}"`
5. Watch the server console log for scrape progress per source and final summary object.
6. Verify articles table in Supabase contains newly inserted articles with title, image URL, published date, and clean text.
