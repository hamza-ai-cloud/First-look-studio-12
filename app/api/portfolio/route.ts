import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('portfolio')
    .select(
      'id, title, image_url, category, aspect_ratio, description, is_featured'
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(100);

  if (error) {
    console.error('[Public Portfolio]', error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load portfolio',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: data || [],
  });
}
