import { NextResponse } from 'next/server';

import { requireCmsAdmin } from '@/lib/cms/auth';
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

const COLOR_FIELDS = [
  'primary_color',
  'secondary_color',
  'accent_color',
  'background_color',
  'surface_color',
  'text_color',
  'muted_text_color',
  'border_color',
] as const;

function isValidColor(value: unknown) {
  if (typeof value !== 'string') return false;

  const color = value.trim();

  return (
    /^#[0-9a-fA-F]{6}$/.test(color) ||
    /^#[0-9a-fA-F]{8}$/.test(color)
  );
}

function validateRadius(
  value: unknown,
  field: string
) {
  if (value === undefined) return null;

  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0 ||
    number > 100
  ) {
    return `${field} must be between 0 and 100`;
  }

  return null;
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
      entity_type: 'theme',
      entity_id: entityId,
      description,
      before_data: beforeData ?? null,
      after_data: afterData ?? null,
    });
}

/**
 * GET
 * Return all themes.
 */
export async function GET(request: Request) {
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const { data, error } = await supabaseAdmin
    .from('theme_settings')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

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
 * Create a theme.
 */
export async function POST(request: Request) {
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    const name = String(
      body.name || 'Untitled Theme'
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Theme name is required',
        },
        { status: 400 }
      );
    }

    for (const field of COLOR_FIELDS) {
      if (
        body[field] !== undefined &&
        !isValidColor(body[field])
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `${field} must be a valid hex color`,
          },
          { status: 400 }
        );
      }
    }

    const buttonRadiusError = validateRadius(
      body.button_radius,
      'button_radius'
    );

    if (buttonRadiusError) {
      return NextResponse.json(
        {
          success: false,
          error: buttonRadiusError,
        },
        { status: 400 }
      );
    }

    const cardRadiusError = validateRadius(
      body.card_radius,
      'card_radius'
    );

    if (cardRadiusError) {
      return NextResponse.json(
        {
          success: false,
          error: cardRadiusError,
        },
        { status: 400 }
      );
    }

    const payload = {
      name,

      is_active:
        typeof body.is_active === 'boolean'
          ? body.is_active
          : false,

      primary_color:
        body.primary_color || '#C99634',

      secondary_color:
        body.secondary_color || '#171208',

      accent_color:
        body.accent_color || '#D4A33D',

      background_color:
        body.background_color || '#0B0F14',

      surface_color:
        body.surface_color || '#161B22',

      text_color:
        body.text_color || '#FFFFFF',

      muted_text_color:
        body.muted_text_color || '#8B949E',

      border_color:
        body.border_color || '#30363D',

      heading_font:
        body.heading_font
          ? String(body.heading_font).trim()
          : null,

      body_font:
        body.body_font
          ? String(body.body_font).trim()
          : null,

      button_radius:
        body.button_radius === undefined
          ? 12
          : Number(body.button_radius),

      card_radius:
        body.card_radius === undefined
          ? 20
          : Number(body.card_radius),

      custom_css:
        body.custom_css
          ? String(body.custom_css)
          : null,

      updated_at: new Date().toISOString(),
    };

    if (payload.is_active) {
      await supabaseAdmin
        .from('theme_settings')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('is_active', true);
    }

    const { data, error } = await supabaseAdmin
      .from('theme_settings')
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
      `Created theme "${data.name}"`,
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
 * Update a theme.
 */
export async function PUT(request: Request) {
  const auth = await requireCmsAdmin(request);

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
          error: 'Theme id is required',
        },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('theme_settings')
        .select('*')
        .eq('id', id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingError?.message ||
            'Theme not found',
        },
        { status: existingError ? 500 : 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            error: 'Theme name cannot be empty',
          },
          { status: 400 }
        );
      }

      updates.name = name;
    }

    if (body.is_active !== undefined) {
      if (typeof body.is_active !== 'boolean') {
        return NextResponse.json(
          {
            success: false,
            error: 'is_active must be a boolean',
          },
          { status: 400 }
        );
      }

      updates.is_active = body.is_active;
    }

    for (const field of COLOR_FIELDS) {
      if (body[field] !== undefined) {
        if (!isValidColor(body[field])) {
          return NextResponse.json(
            {
              success: false,
              error: `${field} must be a valid hex color`,
            },
            { status: 400 }
          );
        }

        updates[field] = String(body[field]).trim();
      }
    }

    if (body.heading_font !== undefined) {
      updates.heading_font =
        body.heading_font === null
          ? null
          : String(body.heading_font).trim();
    }

    if (body.body_font !== undefined) {
      updates.body_font =
        body.body_font === null
          ? null
          : String(body.body_font).trim();
    }

    if (body.custom_css !== undefined) {
      updates.custom_css =
        body.custom_css === null
          ? null
          : String(body.custom_css);
    }

    const buttonRadiusError = validateRadius(
      body.button_radius,
      'button_radius'
    );

    if (buttonRadiusError) {
      return NextResponse.json(
        {
          success: false,
          error: buttonRadiusError,
        },
        { status: 400 }
      );
    }

    const cardRadiusError = validateRadius(
      body.card_radius,
      'card_radius'
    );

    if (cardRadiusError) {
      return NextResponse.json(
        {
          success: false,
          error: cardRadiusError,
        },
        { status: 400 }
      );
    }

    if (body.button_radius !== undefined) {
      updates.button_radius =
        Number(body.button_radius);
    }

    if (body.card_radius !== undefined) {
      updates.card_radius =
        Number(body.card_radius);
    }

    if (updates.is_active === true) {
      await supabaseAdmin
        .from('theme_settings')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .neq('id', id)
        .eq('is_active', true);
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('theme_settings')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error:
            error?.message || 'Theme not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    await logActivity(
      auth.admin.id,
      'update',
      id,
      `Updated theme "${data.name}"`,
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
 * Delete a theme.
 */
export async function DELETE(request: Request) {
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const id = new URL(request.url).searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: 'Theme id is required',
      },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('theme_settings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        error: 'Theme not found',
      },
      { status: 404 }
    );
  }

  if (existing.is_active) {
    return NextResponse.json(
      {
        success: false,
        error:
          'The active theme cannot be deleted. Activate another theme first.',
      },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('theme_settings')
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
    `Deleted theme "${existing.name}"`,
    existing,
    null
  );

  return NextResponse.json({
    success: true,
    message: 'Theme deleted successfully',
  });
}
