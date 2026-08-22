import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('gallery')
    .select(
      'id, title, image_url, category, aspect_ratio, description, is_featured'
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(100);

  if (error) {
    console.error('[Public Gallery]', error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load gallery.',
        data: [],
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: data || [],
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
