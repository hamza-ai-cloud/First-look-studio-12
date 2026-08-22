import { NextResponse } from 'next/server';
import { requireContentAdmin } from '@/lib/cms/auth';
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
  const auth = await requireContentAdmin(request);

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
        { success: false, error: 'Image file is required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only JPG, PNG, WEBP, GIF and AVIF images are allowed',
        },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image must be between 1 byte and 10 MB',
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const safeExtension = /^[a-z0-9]+$/.test(extension)
      ? extension
      : 'jpg';

    const filename = `${crypto.randomUUID()}.${safeExtension}`;
    const storagePath = `uploads/${filename}`;

    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('portfolio')
      .upload(storagePath, bytes, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error(
        '[Portfolio Upload]',
        uploadError.message
      );

      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage
      .from('portfolio')
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      data: {
        image_url: publicUrl,
        path: storagePath,
      },
    });
  } catch (error) {
    console.error('[Portfolio Upload]', error);

    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
