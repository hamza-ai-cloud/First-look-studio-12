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
      entity_type: 'site_setting',
      entity_id: entityId,
      description,
      before_data: beforeData ?? null,
      after_data: afterData ?? null,
    });
}

/**
 * GET
 * List all CMS site settings.
 */
export async function GET(request: Request) {
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .order('setting_key', { ascending: true });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: data || [],
  });
}

/**
 * POST
 * Create a new site setting.
 */
export async function POST(request: Request) {
  const auth = await requireSuperAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    const settingKey = String(body.setting_key || '').trim();

    if (!settingKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Setting key is required',
        },
        { status: 400 }
      );
    }

    const settingValue =
      body.setting_value &&
      typeof body.setting_value === 'object'
        ? body.setting_value
        : {};

    const payload = {
      setting_key: settingKey,
      setting_value: settingValue,
      description: body.description
        ? String(body.description).trim()
        : null,
      is_public:
        typeof body.is_public === 'boolean'
          ? body.is_public
          : true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('site_settings')
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
      `Created site setting "${settingKey}"`,
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
 * Update an existing site setting.
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
          error: 'Setting id is required',
        },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('site_settings')
        .select('*')
        .eq('id', id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        {
          success: false,
          error: existingError?.message || 'Setting not found',
        },
        { status: existingError ? 500 : 404 }
      );
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.setting_key !== undefined) {
      const settingKey = String(body.setting_key).trim();

      if (!settingKey) {
        return NextResponse.json(
          {
            success: false,
            error: 'Setting key cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.setting_key = settingKey;
    }

    if (body.setting_value !== undefined) {
      if (
        !body.setting_value ||
        typeof body.setting_value !== 'object'
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Setting value must be an object',
          },
          { status: 400 }
        );
      }

      updates.setting_value = body.setting_value;
    }

    if (body.description !== undefined) {
      updates.description =
        body.description === null
          ? null
          : String(body.description).trim();
    }

    if (body.is_public !== undefined) {
      if (typeof body.is_public !== 'boolean') {
        return NextResponse.json(
          {
            success: false,
            error: 'is_public must be a boolean',
          },
          { status: 400 }
        );
      }

      updates.is_public = body.is_public;
    }

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Setting not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    await logActivity(
      auth.admin.id,
      'update',
      id,
      `Updated site setting "${data.setting_key}"`,
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
 * Delete a site setting.
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
        error: 'Setting id is required',
      },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        error: 'Setting not found',
      },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('site_settings')
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
    `Deleted site setting "${existing.setting_key}"`,
    existing,
    null
  );

  return NextResponse.json({
    success: true,
    message: 'Site setting deleted successfully',
  });
}
