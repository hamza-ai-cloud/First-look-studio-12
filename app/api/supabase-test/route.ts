import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_ROLES = new Set(['admin', 'super_admin']);

async function isAuthorized(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is missing');
  }

  const token = await getToken({
    req: request as any,
    secret,
  });

  if (!token || typeof token.role !== 'string') {
    return false;
  }

  return ADMIN_ROLES.has(token.role);
}

export async function GET(request: Request) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase test database error:', error);

      return NextResponse.json(
        {
          success: false,
          supabase: 'disconnected',
          error: 'Supabase connection test failed',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      supabase: 'connected',
      data: data || [],
    });
  } catch (error) {
    console.error('Supabase test exception:', error);

    return NextResponse.json(
      {
        success: false,
        supabase: 'disconnected',
        error: 'Supabase connection test failed',
      },
      { status: 503 }
    );
  }
}
