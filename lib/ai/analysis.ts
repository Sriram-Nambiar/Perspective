import { generateObject } from 'ai';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/client';
import {
  getPendingArticlesForAnalysis,
  insertLog,
  saveArticleAnalysis,
} from '@/lib/supabase/db';
import type { Article, ArticleAnalysisInsert } from '@/lib/supabase/types';
import { DEFAULT_ANALYSIS_MODEL, getAnalysisModel } from './config';

/**
 * Zod schema for structured AI output.
 */
export const analysisOutputSchema = z.object({
  summary: z
    .string()
    .describe('Neutral, objective summary of the article content in 2-3 paragraphs'),
  sentimentScore: z
    .number()
    .min(-1)
    .max(1)
    .describe('Overall sentiment score from -1.0 (extremely negative) to 1.0 (extremely positive)'),
  sentimentLabel: z
    .enum(['positive', 'neutral', 'negative'])
    .describe('Categorical sentiment label'),
  politicalFramingLabel: z
    .enum(['left', 'center', 'right', 'mixed', 'unclear'])
    .describe(
      'AI-estimated political framing classification based strictly on textual evidence'
    ),
  leftPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe('Estimated proportion of left-leaning framing (0 to 100)'),
  centerPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe('Estimated proportion of neutral or center framing (0 to 100)'),
  rightPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe('Estimated proportion of right-leaning framing (0 to 100)'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence level in political framing evaluation from 0.0 to 1.0'),
  framingNotes: z
    .array(z.string())
    .describe('Key analytical notes regarding tone, sources cited, framing choices, or omitted perspectives'),
  loadedTerms: z
    .array(
      z.object({
        term: z.string().describe('Word or phrase with political or emotional connotation used in text'),
        explanation: z.string().describe('Why this term reflects framing or sentiment'),
        biasTarget: z.string().optional().describe('Target entity or stance affected'),
      })
    )
    .describe('List of loaded or emotionally charged terms identified in the article'),
  disclaimer: z
    .string()
    .describe('Standard disclaimer stating political framing is AI-estimated and not objective truth'),
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;

export interface AnalysisRunSummary {
  status: 'completed' | 'failed' | 'partial';
  total_pending: number;
  analyzed: number;
  skipped: number;
  failed: number;
  duration_ms: number;
  errors: Array<{ article_id: string; title: string; error: string }>;
}

export interface RunAnalysisOptions {
  limit?: number;
  articleIds?: string[];
  batchSize?: number;
  modelName?: string;
}

/**
 * Helper to normalize left, center, right percentages so they strictly sum to 100.
 */
export function normalizePercentages(
  left: number,
  center: number,
  right: number
): { left: number; center: number; right: number } {
  let l = Math.max(0, Math.round(left));
  let c = Math.max(0, Math.round(center));
  let r = Math.max(0, Math.round(right));

  const total = l + c + r;

  if (total === 100) {
    return { left: l, center: c, right: r };
  }

  if (total === 0) {
    return { left: 0, center: 100, right: 0 };
  }

  l = Math.round((l / total) * 100);
  c = Math.round((c / total) * 100);
  r = 100 - l - c;

  if (r < 0) {
    r = 0;
    c = 100 - l;
  }

  return { left: l, center: c, right: r };
}

/**
 * Analyze a single news article with OpenRouter using Vercel AI SDK generateObject.
 * Retries up to 2 times on validation or SDK failure.
 */
export async function analyzeSingleArticle(
  article: Article,
  modelName: string = DEFAULT_ANALYSIS_MODEL
): Promise<ArticleAnalysisInsert> {
  const prompt = `Article Title: ${article.title}\n\nArticle Body:\n${article.raw_text}`;

  let attempts = 0;
  let lastError: unknown = null;

  while (attempts < 2) {
    attempts++;
    try {
      const { object } = await generateObject({
        model: getAnalysisModel(modelName),
        schema: analysisOutputSchema,
        system: `You are a principal news media analyst evaluating news articles for tone, sentiment, and political framing.
Analyze objectively strictly based on text content. Do NOT infer bias based solely on source name or publisher reputation.
IMPORTANT: leftPercentage, centerPercentage, and rightPercentage MUST sum up to exactly 100.
If textual evidence for political framing is weak or balanced, select 'unclear' or 'mixed' for politicalFramingLabel and keep confidence lower.`,
        prompt,
      });

      // Normalize percentages to sum to 100
      const normalized = normalizePercentages(
        object.leftPercentage,
        object.centerPercentage,
        object.rightPercentage
      );

      // Derive bias score: (right - left) / 100
      const biasScore = parseFloat(((normalized.right - normalized.left) / 100).toFixed(2));

      const analysisInsert: ArticleAnalysisInsert = {
        article_id: article.id,
        summary: object.summary,
        sentiment_score: object.sentimentScore,
        sentiment_label: object.sentimentLabel,
        bias_score: biasScore,
        bias_label: object.politicalFramingLabel,
        left_percentage: normalized.left,
        center_percentage: normalized.center,
        right_percentage: normalized.right,
        confidence: object.confidence,
        framing_notes: object.framingNotes,
        loaded_terms: object.loadedTerms,
        disclaimer:
          object.disclaimer ||
          'Political framing analysis is AI-estimated based on textual evidence and is intended for media analytical insights.',
        model: modelName,
      };

      return analysisInsert;
    } catch (err) {
      lastError = err;
      console.warn(
        `[AI Pipeline] Attempt ${attempts} failed for article ${article.id} ("${article.title}"):`,
        err
      );
    }
  }

  throw new Error(
    `Failed to analyze article after 2 attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

/**
 * Execute the AI Analysis Pipeline over pending articles in batches.
 */
export async function runAnalysisPipeline(
  options: RunAnalysisOptions = {}
): Promise<AnalysisRunSummary> {
  const startTime = Date.now();
  const batchSize = options.batchSize || parseInt(process.env.ANALYSIS_BATCH_SIZE || '5', 10);
  const modelName = options.modelName || DEFAULT_ANALYSIS_MODEL;

  console.log(`[AI Pipeline] Starting AI analysis run (model=${modelName}, batchSize=${batchSize})`);
  await insertLog('info', 'AI analysis pipeline started', { options });

  let pendingArticles: Article[] = [];

  if (options.articleIds && options.articleIds.length > 0) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .in('id', options.articleIds);

    if (error) {
      console.error('[AI Pipeline] Error fetching specified article IDs:', error);
      throw error;
    }
    pendingArticles = (data as Article[]) || [];
  } else {
    // LEFT JOIN check per Section 19 of AGENTS.md
    pendingArticles = await getPendingArticlesForAnalysis(options.limit);
  }

  const totalPending = pendingArticles.length;
  console.log(`[AI Pipeline] Found ${totalPending} article(s) needing analysis.`);

  let analyzedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const errors: Array<{ article_id: string; title: string; error: string }> = [];

  if (totalPending === 0) {
    const summary: AnalysisRunSummary = {
      status: 'completed',
      total_pending: 0,
      analyzed: 0,
      skipped: 0,
      failed: 0,
      duration_ms: Date.now() - startTime,
      errors: [],
    };
    console.log('[AI Pipeline] No pending articles to analyze.');
    await insertLog('info', 'AI analysis completed (0 pending articles)', summary as unknown as Record<string, unknown>);
    return summary;
  }

  for (let i = 0; i < pendingArticles.length; i += batchSize) {
    const batch = pendingArticles.slice(i, i + batchSize);
    console.log(
      `[AI Pipeline] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        pendingArticles.length / batchSize
      )} (${batch.length} articles)...`
    );

    for (const article of batch) {
      if (!article.raw_text || article.raw_text.trim().length < 50) {
        console.warn(
          `[AI Pipeline] Skipping article ${article.id} ("${article.title}"): body text missing or too short`
        );
        skippedCount++;
        continue;
      }

      try {
        console.log(`[AI Pipeline] Analyzing article ${article.id}: "${article.title}"`);
        const analysisData = await analyzeSingleArticle(article, modelName);
        await saveArticleAnalysis(analysisData);
        analyzedCount++;
        console.log(`[AI Pipeline] Successfully saved analysis for article ${article.id}`);
      } catch (err: unknown) {
        failedCount++;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`[AI Pipeline] Failed article ${article.id}: ${errMsg}`);
        errors.push({ article_id: article.id, title: article.title, error: errMsg });
      }
    }
  }

  const durationMs = Date.now() - startTime;
  const status = failedCount === 0 ? 'completed' : analyzedCount > 0 ? 'partial' : 'failed';

  const summary: AnalysisRunSummary = {
    status,
    total_pending: totalPending,
    analyzed: analyzedCount,
    skipped: skippedCount,
    failed: failedCount,
    duration_ms: durationMs,
    errors,
  };

  console.log(
    `[AI Pipeline] Pipeline finished: status=${status}, analyzed=${analyzedCount}, skipped=${skippedCount}, failed=${failedCount}, duration=${durationMs}ms`
  );
  await insertLog('info', `AI analysis pipeline ${status}`, summary as unknown as Record<string, unknown>);

  return summary;
}
