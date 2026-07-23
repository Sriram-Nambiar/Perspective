import { NextResponse } from 'next/server';
import { runScrapePipeline } from '@/lib/scraping/pipeline';

export async function POST(request: Request) {
  // Section 15 Admin Secret Rule check
  const adminSecret = request.headers.get('x-biasly-admin-secret');
  const expectedSecret = process.env.BIASLY_ADMIN_SECRET;

  if (!expectedSecret || adminSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized. Invalid or missing x-biasly-admin-secret header.' },
      { status: 401 }
    );
  }

  try {
    let body: { sourceIds?: string[]; limitPerSource?: number } = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional
    }

    const summary = await runScrapePipeline({
      sourceIds: body.sourceIds,
      limitPerSource: body.limitPerSource,
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error executing manual scrape route:', error);
    return NextResponse.json(
      {
        error: 'Scraping pipeline execution failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
