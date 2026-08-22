import { NextResponse } from 'next/server';
import { requireContentAdmin } from '@/lib/cms/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const CONTACT_STATUSES = [
  'new',
  'read',
  'replied',
  'archived',
] as const;


export async function GET(request: Request) {
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('q');

  let query = supabaseAdmin
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (
    status &&
    CONTACT_STATUSES.includes(
      status as (typeof CONTACT_STATUSES)[number]
    )
  ) {
    query = query.eq('status', status);
  }

  if (search) {
    const term = search.replace(/[%_]/g, '\\$&');

    query = query.or(
      `name.ilike.%${term}%,email.ilike.%${term}%,subject.ilike.%${term}%,message.ilike.%${term}%`
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

export async function POST(request: Request) {
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, subject and message are required',
        },
        { status: 400 }
      );
    }

    const status = body.status || 'new';

    if (!CONTACT_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid contact status' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert({
        name,
        email,
        subject,
        message,
        status,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
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

export async function PUT(request: Request) {
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
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
        { success: false, error: 'Contact id is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    const allowedFields = [
      'name',
      'email',
      'subject',
      'message',
      'status',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (
      updates.status !== undefined &&
      !CONTACT_STATUSES.includes(
        String(updates.status) as (typeof CONTACT_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid contact status' },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Contact not found',
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
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Contact id is required' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('contacts')
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
    message: 'Contact deleted successfully',
  });
}
