import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const secret = process.env.NEXTAUTH_SECRET;

async function authorized(request: Request) {
  const token = await getToken({
    req: request as any,
    secret,
  });

  const role = token?.role ? String(token.role) : '';

  return role === 'admin' || role === 'super_admin';
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
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

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

    const title = String(body.title || '').trim();

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Service title is required' },
        { status: 400 }
      );
    }

    const payload = {
      name: body.name ? String(body.name).trim() : null,
      title,
      slug: body.slug ? String(body.slug).trim() : null,
      description: body.description
        ? String(body.description).trim()
        : null,
      category: body.category
        ? String(body.category).trim()
        : null,
      price:
        body.price === null ||
        body.price === undefined ||
        body.price === ''
          ? null
          : Number(body.price),
      image_url: body.image_url
        ? String(body.image_url).trim()
        : null,
      features: Array.isArray(body.features)
        ? body.features
        : [],
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
      .from('services')
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
        { success: false, error: 'Service id is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    const allowedFields = [
      'name',
      'title',
      'slug',
      'description',
      'category',
      'price',
      'image_url',
      'features',
      'is_active',
      'sort_order',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (typeof updates.title === 'string') {
      updates.title = updates.title.trim();

      if (!updates.title) {
        return NextResponse.json(
          { success: false, error: 'Service title is required' },
          { status: 400 }
        );
      }
    }

    if (updates.price === '') {
      updates.price = null;
    } else if (updates.price !== undefined && updates.price !== null) {
      updates.price = Number(updates.price);
    }

    if (updates.updated_at === undefined) {
      updates.updated_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Service not found',
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
      { success: false, error: 'Service id is required' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('services')
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
    message: 'Service deleted successfully',
  });
}
