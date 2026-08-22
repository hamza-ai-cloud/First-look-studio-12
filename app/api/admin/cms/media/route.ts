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
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Media upload requires multipart/form-data',
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'file is required' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are supported' },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 15 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image must be smaller than 15MB',
        },
        { status: 400 }
      );
    }

    const originalName = file.name.trim() || 'image';
    const extension =
      originalName.includes('.')
        ? originalName.split('.').pop()?.toLowerCase() || 'bin'
        : 'bin';

    const baseName = originalName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'image';

    const uniqueName = `${Date.now()}-${crypto.randomUUID()}`;
    const storagePath = `general/${baseName}-${uniqueName}.${extension}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          error: uploadError.message,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    const { data, error } = await supabaseAdmin
      .from('media')
      .insert({
        file_name: originalName,
        storage_path: storagePath,
        public_url: publicUrl,
        mime_type: file.type,
        file_size: file.size,
        folder: 'general',
        is_active: true,
        uploaded_by: auth.admin.id,
      })
      .select('*')
      .single();

    if (error) {
      await supabaseAdmin.storage
        .from('media')
        .remove([storagePath]);

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
      `Uploaded media "${originalName}"`,
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
    console.error('Media upload error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload media',
      },
      { status: 500 }
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

  // Remove the matching Supabase Storage object when this media
  // record points to an object in one of our public buckets.
  try {
    const storagePath = String(existing.storage_path || '').trim();

    if (storagePath) {
      const bucketCandidates = ['media', 'gallery', 'portfolio'];

      for (const bucket of bucketCandidates) {
        try {
          const { error: storageError } = await supabaseAdmin.storage
            .from(bucket)
            .remove([storagePath]);

          if (!storageError) {
            break;
          }
        } catch (storageCleanupError) {
          console.error(
            `[Media Delete] Storage cleanup failed for ${bucket}:`,
            storageCleanupError
          );
        }
      }
    }
  } catch (storageCleanupError) {
    console.error(
      '[Media Delete] Storage cleanup exception:',
      storageCleanupError
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
