import { NextResponse } from 'next/server';
import { requireContentAdmin } from '@/lib/cms/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const secret = process.env.NEXTAUTH_SECRET;

const CAREER_STATUSES = [
  'new',
  'reviewing',
  'shortlisted',
  'rejected',
  'accepted',
] as const;

async function authorized(request: Request) {
  const auth = await requireContentAdmin(request);
  return auth.authorized;
}
export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('q');

  let query = supabaseAdmin
    .from('careers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (
    status &&
    CAREER_STATUSES.includes(
      status as (typeof CAREER_STATUSES)[number]
    )
  ) {
    query = query.eq('status', status);
  }

  if (search) {
    const term = search.replace(/[%_]/g, '\\$&');

    query = query.or(
      `name.ilike.%${term}%,email.ilike.%${term}%,position.ilike.%${term}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: data || [],
  });
}

export async function PUT(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Career application id is required' },
        { status: 400 }
      );
    }

    const status = String(body.status || '').trim();

    if (!CAREER_STATUSES.includes(status as (typeof CAREER_STATUSES)[number])) {
      return NextResponse.json(
        { success: false, error: 'Invalid career status' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('careers')
      .update({
        status,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Application not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Invalid request',
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const id = new URL(request.url).searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Career application id is required' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('careers')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Career application deleted successfully',
  });
}
