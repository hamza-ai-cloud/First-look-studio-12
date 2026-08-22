import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/cms/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const secret = process.env.NEXTAUTH_SECRET;

async function authorized(request: Request) {
  const auth = await requireSuperAdmin(request);
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
  const active = url.searchParams.get('active');

  let query = supabaseAdmin
    .from('branches')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (active === 'true') {
    query = query.eq('is_active', true);
  }

  if (active === 'false') {
    query = query.eq('is_active', false);
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
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name = String(body.name || '').trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Branch name is required' },
        { status: 400 }
      );
    }

    const payload = {
      name,
      address: body.address
        ? String(body.address).trim()
        : null,
      phone: body.phone
        ? String(body.phone).trim()
        : null,
      email: body.email
        ? String(body.email).trim()
        : null,
      hours: body.hours
        ? String(body.hours).trim()
        : null,
      maps_url: body.maps_url
        ? String(body.maps_url).trim()
        : null,
      is_active:
        typeof body.is_active === 'boolean'
          ? body.is_active
          : true,
      sort_order:
        Number.isFinite(Number(body.sort_order))
          ? Number(body.sort_order)
          : 0,
    };

    const { data, error } = await supabaseAdmin
      .from('branches')
      .insert(payload)
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
        { success: false, error: 'Branch id is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    const allowedFields = [
      'name',
      'address',
      'phone',
      'email',
      'hours',
      'maps_url',
      'is_active',
      'sort_order',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (typeof updates.name === 'string') {
      updates.name = updates.name.trim();

      if (!updates.name) {
        return NextResponse.json(
          { success: false, error: 'Branch name is required' },
          { status: 400 }
        );
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('branches')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Branch not found',
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

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Branch id is required' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('branches')
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
    message: 'Branch deleted successfully',
  });
}
