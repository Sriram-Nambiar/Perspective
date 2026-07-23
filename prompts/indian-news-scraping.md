# Implementation Prompt: Indian News Scraping & AI Pipeline

## Goal
Seed Indian news sources into Supabase (`The Indian Express`, `The Hindu`, `Times of India`, `NDTV`, `Hindustan Times`), run live Oxylabs scraping for 2–3 articles per source, run AI bias & sentiment analysis on the scraped articles, and display the results on the home page.

## Skills Read
- `.agents/skills/oxylabs-web-scraper` — Oxylabs Web Scraper API usage and article extraction rules
- `.agents/skills/supabase` — Supabase database insertion and deduplication rules
- `.agents/skills/ai-sdk` — Structured output AI analysis for bias and sentiment

## Existing Code Inspected
- `supabase/schema.sql` — Seed sources configuration
- `lib/scraping/extractors.ts` — Candidate article URL validation rules for Indian news
- `lib/scraping/pipeline.ts` — Scrape-to-insert orchestration
- `lib/ai/analysis.ts` — Structured AI analysis pipeline
- `app/page.tsx` — Home page UI renderer

## Decisions & Assumptions
1. Target Indian news sources: **The Indian Express**, **The Hindu**, **Times of India**, **NDTV**, and **Hindustan Times**.
2. Scrape limit: 2–3 valid articles per active source.
3. First ensure `schema.sql` is applied in Supabase so the `sources`, `articles`, and `article_analyses` tables exist.
4. Run `POST /api/scrape` with `limitPerSource: 3` to extract live articles.
5. Run `POST /api/analyze` to generate AI neutral summary, sentiment score, and political bias breakdown.

## Files Changed / Likely to Change
- [schema.sql](file:///c:/Users/Swathi/Desktop/news/supabase/schema.sql) — Added Indian news sources to seed data
- [extractors.ts](file:///c:/Users/Swathi/Desktop/news/lib/scraping/extractors.ts) — Added Indian news candidate URL extractors
- [db.ts](file:///c:/Users/Swathi/Desktop/news/lib/supabase/db.ts) — Improved database query error handling

## Implementation Requirements
- Deduplicate articles by `original_url`.
- Validate each article detail page (body length > 900 chars or 3+ paragraphs, image URL, published date).
- Generate AI analysis using Vercel AI SDK (OpenRouter/OpenAI provider).
- Render real news cards on the homepage with source, sentiment badge, bias percentages, and AI confidence.

## Security Requirements
- Request `POST /api/scrape` and `POST /api/analyze` using header `x-biasly-admin-secret: fsa34dafw4rfan`.

## Acceptance Criteria
- 2–3 valid articles per Indian news source inserted into Supabase.
- AI bias analysis saved for each inserted article.
- Homepage displays real Indian news cards with full perspective breakdowns.

## Checks to Run
- `npx tsc --noEmit`
- `npm run build`

## Exact Manual Test Steps
1. Execute `supabase/schema.sql` in Supabase SQL Editor.
2. Run `curl -X POST http://localhost:3000/api/scrape -H "x-biasly-admin-secret: fsa34dafw4rfan" -H "Content-Type: application/json" -d '{"limitPerSource": 3}'`
3. Run `curl -X POST http://localhost:3000/api/analyze -H "x-biasly-admin-secret: fsa34dafw4rfan" -H "Content-Type: application/json"`
4. Open `http://localhost:3000` to verify live Indian news cards.
