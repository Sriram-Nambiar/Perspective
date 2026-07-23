-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. SOURCES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  listing_url TEXT NOT NULL,
  parser_strategy TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index on active status for fast filtering during scraping
CREATE INDEX IF NOT EXISTS idx_sources_active ON public.sources (active);

-- -----------------------------------------------------------------------------
-- 2. ARTICLES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL UNIQUE,
  canonical_url TEXT,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  published_date TIMESTAMPTZ NOT NULL,
  raw_text TEXT NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  analyzed_at TIMESTAMPTZ
);

-- Indexes for deduplication and analysis lookups
CREATE INDEX IF NOT EXISTS idx_articles_original_url ON public.articles (original_url);
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON public.articles (source_id);
CREATE INDEX IF NOT EXISTS idx_articles_analyzed_at ON public.articles (analyzed_at);

-- -----------------------------------------------------------------------------
-- 3. ARTICLE_ANALYSES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.article_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL UNIQUE REFERENCES public.articles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  sentiment_score NUMERIC NOT NULL,
  sentiment_label TEXT NOT NULL,
  bias_score NUMERIC NOT NULL,
  bias_label TEXT NOT NULL,
  left_percentage INTEGER NOT NULL CHECK (left_percentage >= 0 AND left_percentage <= 100),
  center_percentage INTEGER NOT NULL CHECK (center_percentage >= 0 AND center_percentage <= 100),
  right_percentage INTEGER NOT NULL CHECK (right_percentage >= 0 AND right_percentage <= 100),
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  framing_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  loaded_terms JSONB NOT NULL DEFAULT '[]'::jsonb,
  disclaimer TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_percentage_sum CHECK (left_percentage + center_percentage + right_percentage = 100)
);

CREATE INDEX IF NOT EXISTS idx_article_analyses_article_id ON public.article_analyses (article_id);
CREATE INDEX IF NOT EXISTS idx_article_analyses_bias_label ON public.article_analyses (bias_label);

-- -----------------------------------------------------------------------------
-- 4. LOGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs (created_at DESC);

-- -----------------------------------------------------------------------------
-- 5. OXYLABS_SCHEDULES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.oxylabs_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  schedule_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  cron TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oxylabs_schedules_schedule_id ON public.oxylabs_schedules (schedule_id);

-- -----------------------------------------------------------------------------
-- 6. OXYLABS_SCHEDULE_RUNS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.oxylabs_schedule_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id TEXT REFERENCES public.oxylabs_schedules(schedule_id) ON DELETE CASCADE,
  job_id TEXT NOT NULL,
  status TEXT NOT NULL,
  articles_scraped INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_oxylabs_schedule_runs_schedule_id ON public.oxylabs_schedule_runs (schedule_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedule_runs ENABLE ROW LEVEL SECURITY;

-- Public SELECT policies for anon and authenticated users
CREATE POLICY "Allow public read access to sources"
  ON public.sources FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to article_analyses"
  ON public.article_analyses FOR SELECT
  TO anon, authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- SEED ACTIVE SOURCES
-- -----------------------------------------------------------------------------
INSERT INTO public.sources (name, listing_url, parser_strategy, active, logo_url)
VALUES
  ('The Indian Express', 'https://indianexpress.com', 'indianexpress', true, 'https://indianexpress.com/wp-content/themes/indianexpress/images/express-logo-n.png'),
  ('The Hindu', 'https://www.thehindu.com', 'hindu', true, 'https://www.thehindu.com/theme/images/th-online/logo.png'),
  ('Times of India', 'https://timesofindia.indiatimes.com', 'toi', true, 'https://timesofindia.indiatimes.com/photo/52672522.cms'),
  ('NDTV', 'https://www.ndtv.com', 'ndtv', true, 'https://www.ndtv.com/static/images/logo_ndtv.png'),
  ('Hindustan Times', 'https://www.hindustantimes.com', 'ht', true, 'https://www.hindustantimes.com/res/images/ht-logo.svg'),
  ('Reuters', 'https://www.reuters.com', 'reuters', true, 'https://www.reuters.com/pf/resources/images/reuters/logo-vertical-default-png.png'),
  ('BBC News', 'https://www.bbc.com/news', 'bbc', true, 'https://nav.files.bbci.co.uk/searchbox/3.1.2/images/bbc-logo.svg')
ON CONFLICT DO NOTHING;
