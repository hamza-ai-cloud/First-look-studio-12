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
    entity_type: 'page_section',
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
  const pageId = url.searchParams.get('page_id');

  let query = supabaseAdmin
    .from('page_sections')
    .select('*')
    .order('sort_order', { ascending: true });

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

    const pageId = String(body.page_id || '').trim();
    const sectionKey = String(body.section_key || '').trim();
    const sectionType = String(body.section_type || '').trim();

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: 'page_id is required' },
        { status: 400 }
      );
    }

    if (!sectionKey) {
      return NextResponse.json(
        { success: false, error: 'section_key is required' },
        { status: 400 }
      );
    }

    if (!sectionType) {
      return NextResponse.json(
        { success: false, error: 'section_type is required' },
        { status: 400 }
      );
    }

    const { data: page } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('id', pageId)
      .maybeSingle();

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const sortOrder = Number(body.sort_order);

    const payload = {
      page_id: pageId,
      section_key: sectionKey,
      section_type: sectionType,
      title:
        body.title === undefined || body.title === null
          ? null
          : String(body.title).trim(),
      content:
        body.content &&
        typeof body.content === 'object'
          ? body.content
          : {},
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_visible:
        typeof body.is_visible === 'boolean'
          ? body.is_visible
          : true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('page_sections')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    await logActivity(
      auth.admin.id,
      'create',
      data.id,
      `Created section "${data.section_key}"`,
      null,
      data
    );

    return NextResponse.json(
      { success: true, data },
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
        { success: false, error: 'Section id is required' },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('page_sections')
        .select('*')
        .eq('id', id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingError?.message || 'Section not found',
        },
        { status: existingError ? 500 : 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.section_key !== undefined) {
      const value = String(body.section_key).trim();

      if (!value) {
        return NextResponse.json(
          {
            success: false,
            error: 'section_key cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.section_key = value;
    }

    if (body.section_type !== undefined) {
      const value = String(body.section_type).trim();

      if (!value) {
        return NextResponse.json(
          {
            success: false,
            error: 'section_type cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.section_type = value;
    }

    if (body.title !== undefined) {
      updates.title =
        body.title === null
          ? null
          : String(body.title).trim();
    }

    if (body.content !== undefined) {
      if (
        !body.content ||
        typeof body.content !== 'object'
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'content must be an object',
          },
          { status: 400 }
        );
      }

      updates.content = body.content;
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

    if (body.is_visible !== undefined) {
      if (typeof body.is_visible !== 'boolean') {
        return NextResponse.json(
          {
            success: false,
            error: 'is_visible must be a boolean',
          },
          { status: 400 }
        );
      }

      updates.is_visible = body.is_visible;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('page_sections')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Section not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    await logActivity(
      auth.admin.id,
      'update',
      id,
      `Updated section "${data.section_key}"`,
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
      { success: false, error: 'Section id is required' },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('page_sections')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      { success: false, error: 'Section not found' },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('page_sections')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  await logActivity(
    auth.admin.id,
    'delete',
    id,
    `Deleted section "${existing.section_key}"`,
    existing,
    null
  );

  return NextResponse.json({
    success: true,
    message: 'Section deleted successfully',
  });
}
