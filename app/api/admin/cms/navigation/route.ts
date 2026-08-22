import { NextResponse } from 'next/server';

import { requireSuperAdmin } from '@/lib/cms/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const LOCATIONS = [
  'header',
  'footer',
  'mobile',
  'custom',
] as const;

function unauthorized() {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

function validLocation(value: unknown) {
  return (
    typeof value === 'string' &&
    LOCATIONS.includes(
      value as (typeof LOCATIONS)[number]
    )
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
    entity_type: 'navigation',
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

  const location = new URL(request.url).searchParams.get(
    'location'
  );

  let query = supabaseAdmin
    .from('navigation_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (location && validLocation(location)) {
    query = query.eq('location', location);
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

    const label = String(body.label || '').trim();
    const href = String(body.href || '').trim();
    const location = String(body.location || 'header');

    if (!label) {
      return NextResponse.json(
        { success: false, error: 'Navigation label is required' },
        { status: 400 }
      );
    }

    if (!href) {
      return NextResponse.json(
        { success: false, error: 'Navigation URL is required' },
        { status: 400 }
      );
    }

    if (!validLocation(location)) {
      return NextResponse.json(
        { success: false, error: 'Invalid navigation location' },
        { status: 400 }
      );
    }

    const sortOrder = Number(body.sort_order);

    const payload = {
      location,
      label,
      href,

      icon:
        body.icon === undefined || body.icon === null
          ? null
          : String(body.icon).trim(),

      parent_id: body.parent_id || null,

      sort_order: Number.isFinite(sortOrder)
        ? sortOrder
        : 0,

      is_visible:
        typeof body.is_visible === 'boolean'
          ? body.is_visible
          : true,

      open_new_tab:
        typeof body.open_new_tab === 'boolean'
          ? body.open_new_tab
          : false,

      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('navigation_items')
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
      `Created navigation item "${data.label}"`,
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
        { success: false, error: 'Navigation id is required' },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('navigation_items')
        .select('*')
        .eq('id', id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingError?.message ||
            'Navigation item not found',
        },
        { status: existingError ? 500 : 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.location !== undefined) {
      const location = String(body.location);

      if (!validLocation(location)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid navigation location',
          },
          { status: 400 }
        );
      }

      updates.location = location;
    }

    if (body.label !== undefined) {
      const label = String(body.label).trim();

      if (!label) {
        return NextResponse.json(
          {
            success: false,
            error: 'Navigation label cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.label = label;
    }

    if (body.href !== undefined) {
      const href = String(body.href).trim();

      if (!href) {
        return NextResponse.json(
          {
            success: false,
            error: 'Navigation URL cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.href = href;
    }

    if (body.icon !== undefined) {
      updates.icon =
        body.icon === null
          ? null
          : String(body.icon).trim();
    }

    if (body.parent_id !== undefined) {
      updates.parent_id = body.parent_id || null;
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

    if (body.open_new_tab !== undefined) {
      if (typeof body.open_new_tab !== 'boolean') {
        return NextResponse.json(
          {
            success: false,
            error: 'open_new_tab must be a boolean',
          },
          { status: 400 }
        );
      }

      updates.open_new_tab = body.open_new_tab;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('navigation_items')
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
            'Navigation item not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    await logActivity(
      auth.admin.id,
      'update',
      id,
      `Updated navigation item "${data.label}"`,
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
      { success: false, error: 'Navigation id is required' },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('navigation_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      { success: false, error: 'Navigation item not found' },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('navigation_items')
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
    `Deleted navigation item "${existing.label}"`,
    existing,
    null
  );

  return NextResponse.json({
    success: true,
    message: 'Navigation item deleted successfully',
  });
}
