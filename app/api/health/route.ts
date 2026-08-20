import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('bookings')
      .select('id', {
        count: 'exact',
        head: true,
      });

    if (error) {
      console.error('Health check database error:', error);

      return NextResponse.json(
        {
          success: false,
          supabase: 'disconnected',
          error: 'Database health check failed',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      supabase: 'connected',
      bookings: count ?? 0,
    });
  } catch (error) {
    console.error('Health check exception:', error);

    return NextResponse.json(
      {
        success: false,
        supabase: 'disconnected',
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}
