import { NextResponse } from 'next/server';

import { requireSuperAdmin } from '@/lib/cms/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized',
    },
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
  await supabaseAdmin
    .from('cms_activity_log')
    .insert({
      admin_id: adminId,
      action,
      entity_type: 'page',
      entity_id: entityId,
      description,
      before_data: beforeData ?? null,
      after_data: afterData ?? null,
    });
}

const PAGE_STATUSES = [
  'draft',
  'published',
  'archived',
] as const;

function validStatus(value: unknown) {
  return (
    typeof value === 'string' &&
    PAGE_STATUSES.includes(
      value as (typeof PAGE_STATUSES)[number]
    )
  );
}

/**
 * GET
 * List pages with their sections.
 */
export async function GET(request: Request) {
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const url = new URL(request.url);

  const status = url.searchParams.get('status');
  const slug = url.searchParams.get('slug');

  let query = supabaseAdmin
    .from('pages')
    .select(
      `
        *,
        page_sections (
          *
        )
      `
    )
    .order('sort_order', {
      ascending: true,
    });

  if (status && validStatus(status)) {
    query = query.eq('status', status);
  }

  if (slug) {
    query = query.eq('slug', slug);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  const pages = (data || []).map((page) => ({
    ...page,
    page_sections: Array.isArray(page.page_sections)
      ? [...page.page_sections].sort(
          (a, b) =>
            Number(a.sort_order || 0) -
            Number(b.sort_order || 0)
        )
      : [],
  }));

  return NextResponse.json({
    success: true,
    data: pages,
  });
}

/**
 * POST
 * Create a page.
 */
export async function POST(request: Request) {
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    const title = String(body.title || '').trim();

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Page title is required',
        },
        { status: 400 }
      );
    }

    const slug = String(
      body.slug || title
    )
      .trim()
      .toLowerCase()
      .replace(/^\/+/, '')
      .replace(/\/+$/, '')
      .replace(/[^a-z0-9/_-]+/g, '-')
      .replace(/-+/g, '-');

    const finalSlug = slug ? `/${slug}` : '/';

    const status =
      body.status === undefined
        ? 'draft'
        : String(body.status);

    if (!validStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid page status',
        },
        { status: 400 }
      );
    }

    const payload = {
      slug: finalSlug,
      title,

      status,

      template: body.template
        ? String(body.template).trim()
        : 'default',

      excerpt:
        body.excerpt === undefined ||
        body.excerpt === null
          ? null
          : String(body.excerpt).trim(),

      content:
        body.content &&
        typeof body.content === 'object'
          ? body.content
          : {},

      featured_image_id:
        body.featured_image_id || null,

      seo_title:
        body.seo_title === undefined ||
        body.seo_title === null
          ? null
          : String(body.seo_title).trim(),

      seo_description:
        body.seo_description === undefined ||
        body.seo_description === null
          ? null
          : String(body.seo_description).trim(),

      seo_keywords:
        body.seo_keywords === undefined ||
        body.seo_keywords === null
          ? null
          : String(body.seo_keywords).trim(),

      og_image_url:
        body.og_image_url === undefined ||
        body.og_image_url === null
          ? null
          : String(body.og_image_url).trim(),

      sort_order:
        Number.isFinite(Number(body.sort_order))
          ? Number(body.sort_order)
          : 0,

      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('pages')
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
      `Created page "${data.title}"`,
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

/**
 * PUT
 * Update a page.
 */
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
          error: 'Page id is required',
        },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingError?.message ||
            'Page not found',
        },
        { status: existingError ? 500 : 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = String(body.title).trim();

      if (!title) {
        return NextResponse.json(
          {
            success: false,
            error: 'Page title cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.title = title;
    }

    if (body.slug !== undefined) {
      const slug = String(body.slug)
        .trim()
        .toLowerCase()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '')
        .replace(/[^a-z0-9/_-]+/g, '-')
        .replace(/-+/g, '-');

      updates.slug = slug ? `/${slug}` : '/';
    }

    if (body.status !== undefined) {
      const status = String(body.status);

      if (!validStatus(status)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid page status',
          },
          { status: 400 }
        );
      }

      updates.status = status;
    }

    const stringFields = [
      'template',
      'excerpt',
      'seo_title',
      'seo_description',
      'seo_keywords',
      'og_image_url',
    ];

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        updates[field] =
          body[field] === null
            ? null
            : String(body[field]).trim();
      }
    }

    if (body.content !== undefined) {
      if (
        !body.content ||
        typeof body.content !== 'object'
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Page content must be an object',
          },
          { status: 400 }
        );
      }

      updates.content = body.content;
    }

    if (body.featured_image_id !== undefined) {
      updates.featured_image_id =
        body.featured_image_id || null;
    }

    if (body.sort_order !== undefined) {
      const sortOrder = Number(body.sort_order);

      if (!Number.isFinite(sortOrder)) {
        return NextResponse.json(
          {
            success: false,
            error: 'sort_order must be a number',
          },
          { status: 400 }
        );
      }

      updates.sort_order = sortOrder;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error:
            error?.message || 'Page not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    await logActivity(
      auth.admin.id,
      'update',
      id,
      `Updated page "${data.title}"`,
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

/**
 * DELETE
 * Delete a page and all of its sections.
 */
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
        error: 'Page id is required',
      },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('pages')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        error: 'Page not found',
      },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('pages')
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
    `Deleted page "${existing.title}"`,
    existing,
    null
  );

  return NextResponse.json({
    success: true,
    message: 'Page deleted successfully',
  });
}
