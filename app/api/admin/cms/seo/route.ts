import { NextResponse } from 'next/server';

import { requireSuperAdmin } from '@/lib/cms/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

async function logActivity(
  adminId: string | null,
  action: string,
  entityId: string | null,
  description: string,
  beforeData?: unknown,
  afterData?: unknown
) {
  await supabaseAdmin.from('cms_activity_log').insert({
    admin_id: adminId,
    action,
    entity_type: 'seo',
    entity_id: entityId,
    description,
    before_data: beforeData ?? null,
    after_data: afterData ?? null,
  });
}

export async function GET(request: Request) {
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const routePath = url.searchParams.get('route');
  const pageId = url.searchParams.get('page_id');

  let query = supabaseAdmin
    .from('seo_metadata')
    .select('*')
    .order('created_at', { ascending: false });

  if (routePath) {
    query = query.eq('route_path', routePath);
  }

  if (pageId) {
    query = query.eq('page_id', pageId);
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
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    const routePath = String(
      body.route_path || ''
    ).trim();

    if (!routePath) {
      return NextResponse.json(
        {
          success: false,
          error: 'route_path is required',
        },
        { status: 400 }
      );
    }

    const payload = {
      page_id: body.page_id || null,

      route_path: routePath,

      title:
        body.title === undefined ||
        body.title === null
          ? null
          : String(body.title).trim(),

      description:
        body.description === undefined ||
        body.description === null
          ? null
          : String(body.description).trim(),

      keywords:
        body.keywords === undefined ||
        body.keywords === null
          ? null
          : String(body.keywords).trim(),

      canonical_url:
        body.canonical_url === undefined ||
        body.canonical_url === null
          ? null
          : String(body.canonical_url).trim(),

      og_title:
        body.og_title === undefined ||
        body.og_title === null
          ? null
          : String(body.og_title).trim(),

      og_description:
        body.og_description === undefined ||
        body.og_description === null
          ? null
          : String(body.og_description).trim(),

      og_image_url:
        body.og_image_url === undefined ||
        body.og_image_url === null
          ? null
          : String(body.og_image_url).trim(),

      twitter_title:
        body.twitter_title === undefined ||
        body.twitter_title === null
          ? null
          : String(body.twitter_title).trim(),

      twitter_description:
        body.twitter_description === undefined ||
        body.twitter_description === null
          ? null
          : String(body.twitter_description).trim(),

      twitter_image_url:
        body.twitter_image_url === undefined ||
        body.twitter_image_url === null
          ? null
          : String(body.twitter_image_url).trim(),

      robots:
        body.robots === undefined ||
        body.robots === null
          ? 'index,follow'
          : String(body.robots).trim(),

      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('seo_metadata')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    await logActivity(
      auth.admin.id,
      'create',
      data.id,
      `Created SEO metadata for "${data.route_path}"`,
      null,
      data
    );

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
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'SEO id is required',
        },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('seo_metadata')
        .select('*')
        .eq('id', id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingError?.message ||
            'SEO metadata not found',
        },
        { status: existingError ? 500 : 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    const fields = [
      'route_path',
      'title',
      'description',
      'keywords',
      'canonical_url',
      'og_title',
      'og_description',
      'og_image_url',
      'twitter_title',
      'twitter_description',
      'twitter_image_url',
      'robots',
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        updates[field] =
          body[field] === null
            ? null
            : String(body[field]).trim();
      }
    }

    if (body.page_id !== undefined) {
      updates.page_id = body.page_id || null;
    }

    if (body.route_path !== undefined) {
      const routePath = String(body.route_path).trim();

      if (!routePath) {
        return NextResponse.json(
          {
            success: false,
            error: 'route_path cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.route_path = routePath;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('seo_metadata')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error:
            error?.message ||
            'SEO metadata not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    await logActivity(
      auth.admin.id,
      'update',
      id,
      `Updated SEO metadata for "${data.route_path}"`,
      existing,
      data
    );

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
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const id = new URL(request.url).searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: 'SEO id is required',
      },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('seo_metadata')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        error: 'SEO metadata not found',
      },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('seo_metadata')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  await logActivity(
    auth.admin.id,
    'delete',
    id,
    `Deleted SEO metadata for "${existing.route_path}"`,
    existing,
    null
  );

  return NextResponse.json({
    success: true,
    message: 'SEO metadata deleted successfully',
  });
}
