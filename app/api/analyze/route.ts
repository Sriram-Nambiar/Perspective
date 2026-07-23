import { NextRequest, NextResponse } from 'next/server';
import { runAnalysisPipeline } from '@/lib/ai/analysis';

/**
 * POST /api/analyze
 * Triggers AI Analysis Pipeline over unanalyzed news articles.
 * Requires `x-biasly-admin-secret` request header.
 */
export async function POST(req: NextRequest) {
  try {
    // Section 15: Validate admin secret header
    const adminSecret = req.headers.get('x-biasly-admin-secret');
    const expectedSecret = process.env.BIASLY_ADMIN_SECRET;

    if (!expectedSecret || adminSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: missing or invalid admin secret' },
        { status: 401 }
      );
    }

    // Parse optional parameters from body
    let body: { limit?: number; articleIds?: string[]; modelName?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is valid
    }

    const { limit, articleIds, modelName } = body;

    // Run the analysis pipeline
    const summary = await runAnalysisPipeline({
      limit: typeof limit === 'number' ? limit : undefined,
      articleIds: Array.isArray(articleIds) ? articleIds : undefined,
      modelName: typeof modelName === 'string' ? modelName : undefined,
    });

    return NextResponse.json(summary, { status: 200 });
  } catch (error: unknown) {
    console.error('[API /api/analyze] Fatal error running analysis pipeline:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: errorMessage },
      { status: 500 }
    );
  }
}
