import { NextResponse } from 'next/server';
import { getActiveSources } from '@/lib/supabase/db';

export async function GET() {
  try {
    const sources = await getActiveSources();
    return NextResponse.json({
      success: true,
      count: sources.length,
      sources,
    });
  } catch (error) {
    console.error('API /api/sources GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sources',
      },
      { status: 500 }
    );
  }
}
