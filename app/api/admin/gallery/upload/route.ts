import { NextResponse } from 'next/server';

import { requireCmsAdmin } from '@/lib/cms/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export async function POST(request: Request) {
  const auth = await requireCmsAdmin(request);

  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Please select an image.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported image type. Please use JPG, PNG, WEBP, GIF or AVIF.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image is too large. Maximum file size is 10 MB.',
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : 'jpg';

    const baseName =
      file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'gallery-image';

    const storagePath =
      `${baseName}-${crypto.randomUUID()}.${extension || 'jpg'}`;

    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('gallery')
      .upload(storagePath, bytes, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Gallery Upload]', uploadError);

      return NextResponse.json(
        {
          success: false,
          error: uploadError.message || 'Failed to upload image.',
        },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from('gallery')
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      data: {
        file_name: file.name,
        storage_path: storagePath,
        image_url: data.publicUrl,
        mime_type: file.type,
        file_size: file.size,
      },
    });
  } catch (error) {
    console.error('[Gallery Upload]', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload image.',
      },
      { status: 500 }
    );
  }
}
