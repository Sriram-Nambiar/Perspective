import { createAdminClient, createClient } from './client';
import type {
  Article,
  ArticleAnalysis,
  ArticleWithDetails,
  Database,
  Log,
  OxylabsSchedule,
  OxylabsScheduleRun,
  Source,
} from './types';

// =============================================================================
// SOURCES DATA ACCESS
// =============================================================================

/**
 * Fetch all active news sources from Supabase.
 */
export async function getActiveSources(): Promise<Source[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching active sources:', error);
    throw error;
  }

  return (data as Source[]) || [];
}

/**
 * Fetch all news sources (active and inactive).
 */
export async function getAllSources(): Promise<Source[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching all sources:', error);
    throw error;
  }

  return (data as Source[]) || [];
}

/**
 * Fetch a single news source by ID.
 */
export async function getSourceById(id: string): Promise<Source | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error(`Error fetching source ${id}:`, error);
    throw error;
  }

  return data as Source;
}

// =============================================================================
// ARTICLES & DEDUPLICATION DATA ACCESS
// =============================================================================

/**
 * Section 9 URL existence check rule:
 * Query in small chunks and never pass more than 15 URLs to a single `.in()` filter.
 *
 * @param urls List of candidate URLs to check.
 * @returns Set of URLs that ALREADY exist in the articles table.
 */
export async function checkUrlsExist(urls: string[]): Promise<Set<string>> {
  if (!urls || urls.length === 0) return new Set();

  const supabase = createAdminClient();
  const existingUrls = new Set<string>();
  const CHUNK_SIZE = 15;

  // Process candidate URLs in chunks of max 15
  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    const { data, error } = await supabase
      .from('articles')
      .select('original_url')
      .in('original_url', chunk);

    if (error) {
      console.error('Error checking existing article URLs chunk:', error);
      continue;
    }

    if (data) {
      const rows = data as unknown as Array<{ original_url: string }>;
      for (const row of rows) {
        if (row?.original_url) {
          existingUrls.add(row.original_url);
        }
      }
    }
  }

  return existingUrls;
}

/**
 * Filter candidate URLs, keeping only those that do NOT exist in the database yet.
 */
export async function filterNewCandidateUrls(urls: string[]): Promise<string[]> {
  const existingSet = await checkUrlsExist(urls);
  return urls.filter((url) => !existingSet.has(url));
}

/**
 * Insert valid articles into Supabase (append-only deduplicated by original_url).
 */
export async function insertArticles(
  articles: Database['public']['Tables']['articles']['Insert'][]
): Promise<Article[]> {
  if (!articles || articles.length === 0) return [];

  const supabase = createAdminClient();

  const { data, error } = await (supabase.from('articles') as unknown as {
    upsert: (
      payload: unknown,
      opts: { onConflict: string; ignoreDuplicates: boolean }
    ) => { select: (cols: string) => Promise<{ data: Article[]; error: unknown }> };
  })
    .upsert(articles, { onConflict: 'original_url', ignoreDuplicates: true })
    .select('*');

  if (error) {
    console.error('Error inserting articles into Supabase:', error);
    throw error;
  }

  return (data as Article[]) || [];
}

interface PendingArticlesQueryBuilder {
  limit: (l: number) => Promise<{ data: unknown; error: unknown }>;
  then: Promise<{ data: unknown; error: unknown }>['then'];
}

/**
 * Section 19 Pending-analysis check rule:
 * Detect pending articles by LEFT JOINing `articles` to `article_analyses`.
 * Never rely on `analyzed_at IS NULL` alone. An article is pending when no
 * `article_analyses` row exists for it.
 */
export async function getPendingArticlesForAnalysis(limit?: number): Promise<Article[]> {
  const supabase = createAdminClient();

  // LEFT JOIN articles with article_analyses and filter where article_analyses.id IS NULL
  let query: PendingArticlesQueryBuilder = (supabase.from('articles') as unknown as {
    select: (cols: string) => {
      is: (col: string, val: null) => {
        order: (col: string, opts: { ascending: boolean }) => PendingArticlesQueryBuilder;
      };
    };
  })
    .select('*, article_analyses!left(id)')
    .is('article_analyses.id', null)
    .order('scraped_at', { ascending: false });

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pending articles for analysis:', error);
    throw error;
  }

  // Clean up joined relation before returning Article array
  const rawRows = (data || []) as unknown as Array<Article & { article_analyses?: unknown }>;
  return rawRows.map((row) => {
    const item = { ...row };
    delete item.article_analyses;
    return item as Article;
  });
}

/**
 * Fetch articles along with source and analysis details for UI.
 */
export async function getArticlesWithAnalysis(
  limit: number = 20,
  offset: number = 0
): Promise<ArticleWithDetails[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `
    )
    .not('analyzed_at', 'is', null)
    .order('published_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching articles with analysis:', error);
    return [];
  }

  return (data as unknown as ArticleWithDetails[]) || [];
}

/**
 * Fetch a single article by ID along with its source and analysis details.
 */
export async function getArticleWithAnalysisById(
  id: string
): Promise<ArticleWithDetails | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error(`Error fetching article ${id} with analysis:`, error);
    return null;
  }

  return data as unknown as ArticleWithDetails;
}

// =============================================================================
// ARTICLE ANALYSES DATA ACCESS
// =============================================================================

/**
 * Save an AI analysis to `article_analyses` and update `analyzed_at` on the article.
 */
export async function saveArticleAnalysis(
  analysis: Database['public']['Tables']['article_analyses']['Insert']
): Promise<ArticleAnalysis> {
  const supabase = createAdminClient();

  // Insert or update article_analyses row
  const { data, error } = await (supabase.from('article_analyses') as unknown as {
    upsert: (
      payload: unknown,
      opts: { onConflict: string }
    ) => { select: (cols: string) => { single: () => Promise<{ data: ArticleAnalysis; error: unknown }> } };
  })
    .upsert(analysis, { onConflict: 'article_id' })
    .select('*')
    .single();

  if (error) {
    console.error(`Error saving analysis for article ${analysis.article_id}:`, error);
    throw error;
  }

  // Update analyzed_at timestamp on the article
  const { error: updateError } = await (supabase.from('articles') as unknown as {
    update: (payload: { analyzed_at: string }) => { eq: (col: string, val: string) => Promise<{ error: unknown }> };
  })
    .update({ analyzed_at: new Date().toISOString() })
    .eq('id', analysis.article_id);

  if (updateError) {
    console.error(
      `Saved analysis but failed to update analyzed_at for article ${analysis.article_id}:`,
      updateError
    );
  }

  return data as ArticleAnalysis;
}

// =============================================================================
// LOGS DATA ACCESS
// =============================================================================

/**
 * Record a system execution log into `logs`.
 */
export async function insertLog(
  level: 'info' | 'warn' | 'error' | string,
  message: string,
  details?: Record<string, unknown> | null
): Promise<Log | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await (supabase.from('logs') as unknown as {
      insert: (payload: unknown) => { select: (cols: string) => { single: () => Promise<{ data: Log; error: unknown }> } };
    })
      .insert({
        level,
        message,
        details: details ? (details as unknown as Database['public']['Tables']['logs']['Insert']['details']) : null,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Failed to insert log entry:', error);
      return null;
    }

    return data as Log;
  } catch (err) {
    console.error('Error inserting log entry:', err);
    return null;
  }
}

/**
 * Fetch recent system logs.
 */
export async function getLogs(limit: number = 50): Promise<Log[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return (data as Log[]) || [];
}

// =============================================================================
// OXYLABS SCHEDULER DATA ACCESS
// =============================================================================

/**
 * Fetch stored Oxylabs schedules.
 */
export async function getSchedules(): Promise<OxylabsSchedule[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('oxylabs_schedules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching Oxylabs schedules:', error);
    return [];
  }

  return (data as OxylabsSchedule[]) || [];
}

/**
 * Upsert an Oxylabs schedule record.
 */
export async function upsertSchedule(
  schedule: Database['public']['Tables']['oxylabs_schedules']['Insert']
): Promise<OxylabsSchedule> {
  const supabase = createAdminClient();
  const { data, error } = await (supabase.from('oxylabs_schedules') as unknown as {
    upsert: (
      payload: unknown,
      opts: { onConflict: string }
    ) => { select: (cols: string) => { single: () => Promise<{ data: OxylabsSchedule; error: unknown }> } };
  })
    .upsert(schedule, { onConflict: 'schedule_id' })
    .select('*')
    .single();

  if (error) {
    console.error('Error upserting Oxylabs schedule:', error);
    throw error;
  }

  return data as OxylabsSchedule;
}

/**
 * Delete an Oxylabs schedule record by schedule_id.
 */
export async function deleteScheduleByScheduleId(scheduleId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('oxylabs_schedules')
    .delete()
    .eq('schedule_id', scheduleId);

  if (error) {
    console.error(`Error deleting Oxylabs schedule ${scheduleId}:`, error);
    return false;
  }

  return true;
}

/**
 * Record an Oxylabs schedule run execution.
 */
export async function recordScheduleRun(
  run: Database['public']['Tables']['oxylabs_schedule_runs']['Insert']
): Promise<OxylabsScheduleRun> {
  const supabase = createAdminClient();
  const { data, error } = await (supabase.from('oxylabs_schedule_runs') as unknown as {
    insert: (payload: unknown) => { select: (cols: string) => { single: () => Promise<{ data: OxylabsScheduleRun; error: unknown }> } };
  })
    .insert(run)
    .select('*')
    .single();

  if (error) {
    console.error('Error recording Oxylabs schedule run:', error);
    throw error;
  }

  return data as OxylabsScheduleRun;
}
