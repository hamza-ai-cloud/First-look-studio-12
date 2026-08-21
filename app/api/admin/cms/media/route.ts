import { NextResponse } from 'next/server';

import { requireCmsAdmin } from '@/lib/cms/auth';
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
    entity_type: 'media',
    entity_id: entityId,
    description,
    before_data: beforeData ?? null,
    after_data: afterData ?? null,
  });
}

export async function GET(request: Request) {
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const folder = url.searchParams.get('folder');
  const active = url.searchParams.get('active');
  const q = url.searchParams.get('q');

  let query = supabaseAdmin
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (folder) {
    query = query.eq('folder', folder);
  }

  if (active === 'true') {
    query = query.eq('is_active', true);
  }

  if (active === 'false') {
    query = query.eq('is_active', false);
  }

  if (q) {
    const term = q.replace(/[%_]/g, '\\$&');

    query = query.or(
      `file_name.ilike.%${term}%,alt_text.ilike.%${term}%,caption.ilike.%${term}%`
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
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    const fileName = String(body.file_name || '').trim();
    const storagePath = String(body.storage_path || '').trim();

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'file_name is required' },
        { status: 400 }
      );
    }

    if (!storagePath) {
      return NextResponse.json(
        { success: false, error: 'storage_path is required' },
        { status: 400 }
      );
    }

    const fileSize =
      body.file_size === undefined ||
      body.file_size === null ||
      body.file_size === ''
        ? null
        : Number(body.file_size);

    const width =
      body.width === undefined ||
      body.width === null ||
      body.width === ''
        ? null
        : Number(body.width);

    const height =
      body.height === undefined ||
      body.height === null ||
      body.height === ''
        ? null
        : Number(body.height);

    if (
      fileSize !== null &&
      !Number.isFinite(fileSize)
    ) {
      return NextResponse.json(
        { success: false, error: 'file_size must be a number' },
        { status: 400 }
      );
    }

    if (
      width !== null &&
      !Number.isFinite(width)
    ) {
      return NextResponse.json(
        { success: false, error: 'width must be a number' },
        { status: 400 }
      );
    }

    if (
      height !== null &&
      !Number.isFinite(height)
    ) {
      return NextResponse.json(
        { success: false, error: 'height must be a number' },
        { status: 400 }
      );
    }

    const payload = {
      file_name: fileName,
      storage_path: storagePath,

      public_url: body.public_url
        ? String(body.public_url).trim()
        : null,

      mime_type: body.mime_type
        ? String(body.mime_type).trim()
        : null,

      file_size: fileSize,
      width,
      height,

      alt_text:
        body.alt_text === undefined ||
        body.alt_text === null
          ? null
          : String(body.alt_text).trim(),

      caption:
        body.caption === undefined ||
        body.caption === null
          ? null
          : String(body.caption).trim(),

      folder: body.folder
        ? String(body.folder).trim()
        : 'general',

      is_active:
        typeof body.is_active === 'boolean'
          ? body.is_active
          : true,

      uploaded_by: auth.admin.id,

      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('media')
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
      `Added media "${data.file_name}"`,
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
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Media id is required' },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from('media')
        .select('*')
        .eq('id', id)
        .single();

    if (existingError || !existing) {
      return NextResponse.json(
        {
          success: false,
          error: existingError?.message || 'Media not found',
        },
        { status: existingError ? 500 : 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    const stringFields = [
      'file_name',
      'storage_path',
      'public_url',
      'mime_type',
      'alt_text',
      'caption',
      'folder',
    ];

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        updates[field] =
          body[field] === null
            ? null
            : String(body[field]).trim();
      }
    }

    for (const field of ['file_size', 'width', 'height']) {
      if (body[field] !== undefined) {
        if (body[field] === null || body[field] === '') {
          updates[field] = null;
          continue;
        }

        const value = Number(body[field]);

        if (!Number.isFinite(value) || value < 0) {
          return NextResponse.json(
            {
              success: false,
              error: `${field} must be a valid positive number`,
            },
            { status: 400 }
          );
        }

        updates[field] = value;
      }
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

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('media')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Media not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    await logActivity(
      auth.admin.id,
      'update',
      id,
      `Updated media "${data.file_name}"`,
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
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const id = new URL(request.url).searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Media id is required' },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from('media')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json(
      { success: false, error: 'Media not found' },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('media')
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
    `Deleted media "${existing.file_name}"`,
    existing,
    null
  );

  return NextResponse.json({
    success: true,
    message: 'Media deleted successfully',
  });
}
