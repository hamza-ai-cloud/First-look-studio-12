import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const secret = process.env.NEXTAUTH_SECRET;

const CATEGORIES = [
  'Weddings',
  'Portraits',
  'Fashion',
  'Commercial',
  'Events',
  'Cinematic',
] as const;

const ASPECT_RATIOS = [
  'portrait',
  'landscape',
  'square',
] as const;

async function authorized(request: Request) {
  const token = await getToken({
    req: request as any,
    secret,
  });

  const role = token?.role ? String(token.role) : '';

  return role === 'admin' || role === 'super_admin';
}

export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('q');

  let query = supabaseAdmin
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(1000);

  if (
    category &&
    CATEGORIES.includes(
      category as (typeof CATEGORIES)[number]
    )
  ) {
    query = query.eq('category', category);
  }

  if (search) {
    const term = search.replace(/[%_]/g, '\\$&');

    query = query.or(
      `title.ilike.%${term}%,category.ilike.%${term}%`
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
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const title = String(body.title || '').trim();
    const imageUrl = String(body.image_url || '').trim();
    const category = String(body.category || '').trim();
    const aspectRatio = String(
      body.aspect_ratio || 'landscape'
    ).trim();

    if (!title || !imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and image URL are required',
        },
        { status: 400 }
      );
    }

    if (
      !CATEGORIES.includes(
        category as (typeof CATEGORIES)[number]
      )
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid gallery category' },
        { status: 400 }
      );
    }

    if (
      !ASPECT_RATIOS.includes(
        aspectRatio as (typeof ASPECT_RATIOS)[number]
      )
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid aspect ratio' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('gallery')
      .insert({
        title,
        image_url: imageUrl,
        category,
        aspect_ratio: aspectRatio,
        is_featured: Boolean(body.is_featured),
        is_active:
          body.is_active === undefined
            ? true
            : Boolean(body.is_active),
        description: body.description
          ? String(body.description).trim()
          : null,
        sort_order:
          Number.isFinite(Number(body.sort_order))
            ? Number(body.sort_order)
            : 0,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

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
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Gallery item id is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    const allowedFields = [
      'title',
      'image_url',
      'category',
      'aspect_ratio',
      'description',
      'is_featured',
      'is_active',
      'sort_order',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.category !== undefined) {
      if (
        !CATEGORIES.includes(
          String(updates.category) as (typeof CATEGORIES)[number]
        )
      ) {
        return NextResponse.json(
          { success: false, error: 'Invalid gallery category' },
          { status: 400 }
        );
      }
    }

    if (updates.aspect_ratio !== undefined) {
      if (
        !ASPECT_RATIOS.includes(
          String(updates.aspect_ratio) as (typeof ASPECT_RATIOS)[number]
        )
      ) {
        return NextResponse.json(
          { success: false, error: 'Invalid aspect ratio' },
          { status: 400 }
        );
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('gallery')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Gallery item not found',
        },
        { status: error ? 500 : 404 }
      );
    }

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
  if (!(await authorized(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const id = new URL(request.url).searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Gallery item id is required' },
      { status: 400 }
    );
  }

  const { data: item, error: findError } = await supabaseAdmin
    .from('gallery')
    .select('id, image_url')
    .eq('id', id)
    .single();

  if (findError || !item) {
    return NextResponse.json(
      { success: false, error: 'Gallery item not found' },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // Remove the matching Supabase Storage object when the URL
  // belongs to our gallery bucket.
  try {
    const marker = '/storage/v1/object/public/gallery/';
    const markerIndex = String(item.image_url || '').indexOf(marker);

    if (markerIndex !== -1) {
      const storagePath = decodeURIComponent(
        String(item.image_url).slice(markerIndex + marker.length)
      );

      if (storagePath) {
        const { error: storageError } =
          await supabaseAdmin.storage
            .from('gallery')
            .remove([storagePath]);

        if (storageError) {
          console.error(
            '[Gallery Delete] Storage cleanup failed:',
            storageError.message
          );
        }
      }
    }
  } catch (storageCleanupError) {
    console.error(
      '[Gallery Delete] Storage cleanup exception:',
      storageCleanupError
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Gallery item deleted successfully',
  });
}
