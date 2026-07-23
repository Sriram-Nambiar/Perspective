import { getActiveSources, checkUrlsExist, insertArticles, insertLog } from '@/lib/supabase/db';
import type { Source, ArticleInsert } from '@/lib/supabase/types';
import { scrapeUrlWithOxylabs } from './oxylabs';
import { extractCandidateUrlsFromHomepageHtml, isNonArticleUrl } from './extractors';
import { parseAndValidateArticle } from './cleaner';

export interface ScrapePipelineOptions {
  sourceIds?: string[];
  limitPerSource?: number;
}

export interface SourceScrapeSummary {
  sourceId: string;
  sourceName: string;
  candidatesFound: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  inserted: number;
  rejected: number;
  error?: string;
}

export interface ScrapePipelineSummary {
  status: 'completed' | 'failed' | 'partial_success';
  sourcesChecked: number;
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: Record<string, number>;
  sourceSummaries: SourceScrapeSummary[];
}

/**
 * Execute the canonical Scrape-to-Insert Pipeline (Section 9 & 16).
 */
export async function runScrapePipeline(
  options: ScrapePipelineOptions = {}
): Promise<ScrapePipelineSummary> {
  const startTime = Date.now();
  const limitPerSource = options.limitPerSource || 5;

  console.log(`\n==================================================`);
  console.log(`🚀 Starting Oxylabs Manual Scraping Pipeline`);
  console.log(`==================================================`);

  // Step 1: Load active sources from Supabase
  let activeSources: Source[] = [];
  try {
    const allActive = await getActiveSources();
    if (options.sourceIds && options.sourceIds.length > 0) {
      const selectedSet = new Set(options.sourceIds);
      activeSources = allActive.filter((s) => selectedSet.has(s.id));
    } else {
      activeSources = allActive;
    }
  } catch (err) {
    const message = `Failed to fetch active sources from Supabase: ${err instanceof Error ? err.message : String(err)}`;
    console.error(`❌ ${message}`);
    await insertLog('error', 'Scraping pipeline initialization failed', { error: message });
    throw new Error(message);
  }

  console.log(`📋 Selected ${activeSources.length} active source(s):`, activeSources.map((s) => s.name).join(', '));

  const rejectionReasons: Record<string, number> = {};
  function trackRejection(reason: string) {
    rejectionReasons[reason] = (rejectionReasons[reason] || 0) + 1;
  }

  let totalCandidatesFound = 0;
  let totalCandidatesRejected = 0;
  let totalDuplicatesSkipped = 0;
  let totalDetailPagesScraped = 0;
  let totalArticlesInserted = 0;
  let totalArticlesRejected = 0;
  let totalArticlesFailed = 0;

  const sourceSummaries: SourceScrapeSummary[] = [];

  // Process each active source
  for (const source of activeSources) {
    console.log(`\n--------------------------------------------------`);
    console.log(`📰 Source: ${source.name} (${source.listing_url})`);
    console.log(`--------------------------------------------------`);

    const sourceSummary: SourceScrapeSummary = {
      sourceId: source.id,
      sourceName: source.name,
      candidatesFound: 0,
      duplicatesSkipped: 0,
      detailPagesScraped: 0,
      inserted: 0,
      rejected: 0,
    };

    try {
      // Step 2: Fetch source homepage live via Oxylabs
      console.log(`Fetching homepage HTML from Oxylabs...`);
      const homepageRes = await scrapeUrlWithOxylabs(source.listing_url);
      console.log(`Homepage fetched successfully (HTTP ${homepageRes.statusCode})`);

      // Step 3 & 4: Extract candidate links and reject non-article links
      const candidateUrls = extractCandidateUrlsFromHomepageHtml(homepageRes.content, source.listing_url, source.name);
      sourceSummary.candidatesFound = candidateUrls.length;
      totalCandidatesFound += candidateUrls.length;
      console.log(`Extracted ${candidateUrls.length} candidate story card link(s)`);

      const validCandidates: string[] = [];
      for (const url of candidateUrls) {
        if (isNonArticleUrl(url)) {
          totalCandidatesRejected++;
          trackRejection('Non-article URL pattern');
        } else {
          validCandidates.push(url);
        }
      }

      // Step 5: Check existing candidate URLs in Supabase (Section 9 URL existence check)
      // Chunk check with max 15 URLs per query
      console.log(`Checking DB for existing URLs among ${validCandidates.length} candidate(s)...`);
      const existingUrls = await checkUrlsExist(validCandidates);

      const newCandidateUrls = validCandidates.filter((url) => {
        if (existingUrls.has(url)) {
          sourceSummary.duplicatesSkipped++;
          totalDuplicatesSkipped++;
          return false;
        }
        return true;
      });

      console.log(`Duplicates skipped: ${sourceSummary.duplicatesSkipped}. New candidate(s) to scrape: ${newCandidateUrls.length}`);

      // Limit candidates per source
      const targetUrlsToScrape = newCandidateUrls.slice(0, limitPerSource);

      const validArticlesToInsert: ArticleInsert[] = [];

      // Step 6 & 7: Scrape detail pages and validate content
      for (const candidateUrl of targetUrlsToScrape) {
        console.log(`  Scraping detail page: ${candidateUrl}`);
        sourceSummary.detailPagesScraped++;
        totalDetailPagesScraped++;

        try {
          const detailRes = await scrapeUrlWithOxylabs(candidateUrl);
          const validation = parseAndValidateArticle(detailRes.content, detailRes.url || candidateUrl);

          if (!validation.valid || !validation.article) {
            const reason = validation.reason || 'Failed content validation';
            console.log(`  ❌ Rejected: ${reason}`);
            sourceSummary.rejected++;
            totalArticlesRejected++;
            trackRejection(reason);
            continue;
          }

          const parsed = validation.article;
          validArticlesToInsert.push({
            source_id: source.id,
            original_url: candidateUrl,
            canonical_url: parsed.canonicalUrl,
            title: parsed.title,
            image_url: parsed.imageUrl,
            published_date: parsed.publishedDate,
            raw_text: parsed.rawText,
            scraped_at: new Date().toISOString(),
          });

          console.log(`  ✅ Valid article: "${parsed.title.slice(0, 50)}..."`);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.error(`  ❌ Failed detail scrape for ${candidateUrl}: ${errMsg}`);
          totalArticlesFailed++;
          trackRejection('Detail page scrape request error');
        }
      }

      // Step 8: Insert valid articles into Supabase
      if (validArticlesToInsert.length > 0) {
        console.log(`Inserting ${validArticlesToInsert.length} article(s) into Supabase...`);
        const insertedRows = await insertArticles(validArticlesToInsert);
        sourceSummary.inserted = insertedRows.length;
        totalArticlesInserted += insertedRows.length;
        console.log(`Successfully inserted ${insertedRows.length} article(s) for ${source.name}`);
      } else {
        console.log(`No new valid articles to insert for ${source.name}`);
      }
    } catch (sourceErr) {
      const errMessage = sourceErr instanceof Error ? sourceErr.message : String(sourceErr);
      console.error(`❌ Error scraping source ${source.name}: ${errMessage}`);
      sourceSummary.error = errMessage;
    }

    sourceSummaries.push(sourceSummary);
  }

  const durationMs = Date.now() - startTime;
  const status: ScrapePipelineSummary['status'] =
    totalArticlesInserted > 0
      ? 'completed'
      : sourceSummaries.some((s) => s.error)
      ? 'partial_success'
      : 'completed';

  const summary: ScrapePipelineSummary = {
    status,
    sourcesChecked: activeSources.length,
    candidatesFound: totalCandidatesFound,
    candidatesRejected: totalCandidatesRejected,
    duplicatesSkipped: totalDuplicatesSkipped,
    detailPagesScraped: totalDetailPagesScraped,
    articlesInserted: totalArticlesInserted,
    articlesRejected: totalArticlesRejected,
    articlesFailed: totalArticlesFailed,
    totalDurationMs: durationMs,
    rejectionReasons,
    sourceSummaries,
  };

  console.log(`\n==================================================`);
  console.log(`🏁 Pipeline Summary (${(durationMs / 1000).toFixed(2)}s)`);
  console.log(`Articles Inserted: ${totalArticlesInserted}`);
  console.log(`Duplicates Skipped: ${totalDuplicatesSkipped}`);
  console.log(`Articles Rejected: ${totalArticlesRejected}`);
  console.log(`Detail Pages Scraped: ${totalDetailPagesScraped}`);
  console.log(`==================================================\n`);

  // Log run summary into Supabase logs table
  await insertLog('info', `Oxylabs manual scrape finished (${status})`, summary as unknown as Record<string, unknown>);

  return summary;
}
