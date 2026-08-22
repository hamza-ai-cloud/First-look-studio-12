import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireContentAdmin } from '@/lib/cms/auth';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

export async function GET(request: Request) {
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const { data, error } = await supabaseAdmin
    .from('portfolio')
    .select(
      'id, title, image_url, category, aspect_ratio, description, is_featured, is_active, sort_order, created_at, updated_at'
    )
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Portfolio GET]', error.message);

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
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    const title = String(body.title || '').trim();
    const imageUrl = String(body.image_url || '').trim();

    if (!title || !imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and image_url are required',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio')
      .insert({
        title,
        image_url: imageUrl,
        category: String(body.category || 'Weddings').trim(),
        aspect_ratio: body.aspect_ratio || 'landscape',
        description: body.description
          ? String(body.description).trim()
          : null,
        is_featured: Boolean(body.is_featured),
        is_active:
          body.is_active === undefined
            ? true
            : Boolean(body.is_active),
        sort_order: Number(body.sort_order || 0),
      })
      .select()
      .single();

    if (error) {
      console.error('[Portfolio POST]', error.message);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[Portfolio POST]', error);

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Portfolio item id is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = String(body.title).trim();

      if (!title) {
        return NextResponse.json(
          { success: false, error: 'Title is required' },
          { status: 400 }
        );
      }

      updates.title = title;
    }

    if (body.image_url !== undefined) {
      updates.image_url = String(body.image_url).trim();
    }

    if (body.category !== undefined) {
      updates.category = String(body.category).trim();
    }

    if (body.aspect_ratio !== undefined) {
      updates.aspect_ratio = body.aspect_ratio;
    }

    if (body.description !== undefined) {
      updates.description = body.description
        ? String(body.description).trim()
        : null;
    }

    if (body.is_featured !== undefined) {
      updates.is_featured = Boolean(body.is_featured);
    }

    if (body.is_active !== undefined) {
      updates.is_active = Boolean(body.is_active);
    }

    if (body.sort_order !== undefined) {
      updates.sort_order = Number(body.sort_order);
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Portfolio PUT]', error.message);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[Portfolio PUT]', error);

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireContentAdmin(request);

  if (!auth.authorized) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id')?.trim();

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Portfolio item id is required' },
      { status: 400 }
    );
  }

  const { data: item, error: findError } = await supabaseAdmin
    .from('portfolio')
    .select('id, image_url')
    .eq('id', id)
    .single();

  if (findError || !item) {
    return NextResponse.json(
      { success: false, error: 'Portfolio item not found' },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from('portfolio')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Portfolio DELETE]', error.message);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // Delete the matching Storage object when it belongs to
  // our portfolio bucket.
  try {
    const marker = '/storage/v1/object/public/portfolio/';
    const markerIndex = String(item.image_url || '').indexOf(marker);

    if (markerIndex !== -1) {
      const storagePath = decodeURIComponent(
        String(item.image_url).slice(markerIndex + marker.length)
      );

      if (storagePath) {
        const { error: storageError } =
          await supabaseAdmin.storage
            .from('portfolio')
            .remove([storagePath]);

        if (storageError) {
          console.error(
            '[Portfolio DELETE] Storage cleanup failed:',
            storageError.message
          );
        }
      }
    }
  } catch (storageCleanupError) {
    console.error(
      '[Portfolio DELETE] Storage cleanup exception:',
      storageCleanupError
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Portfolio item deleted successfully',
  });
}
