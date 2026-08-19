import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export const runtime = 'nodejs';

async function authorized(request: Request) {
  const token = await getToken({ req: request as any, secret });
  return !!token && token.role === 'admin';
}

export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  let query = supabaseAdmin
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data || [] });
}

export async function PUT(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json(
      { error: 'Missing id or status' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('contacts')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id')
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Not found' },
      { status: error ? 500 : 404 }
    );
  }

  return NextResponse.json({ success: true });
}
