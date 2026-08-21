import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const secret = process.env.NEXTAUTH_SECRET;

const ROLES = ['admin', 'super_admin'] as const;

type AdminRole = (typeof ROLES)[number];

async function getAuthorizedAdmin(request: Request) {
  const token = await getToken({
    req: request as any,
    secret,
  });

  const role = token?.role ? String(token.role) : '';

  if (role !== 'super_admin') {
    return null;
  }

  return {
    id: token?.id ? String(token.id) : '',
    email: token?.email ? String(token.email) : '',
  };
}

function isValidRole(role: string): role is AdminRole {
  return ROLES.includes(role as AdminRole);
}

function cleanEmail(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

export async function GET(request: Request) {
  const admin = await getAuthorizedAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Super administrator access required' },
      { status: 403 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('admins')
    .select(
      'id, email, role, is_active, created_at, updated_at, last_login_at'
    )
    .order('created_at', { ascending: false });

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
  const admin = await getAuthorizedAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Super administrator access required' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const email = cleanEmail(body.email);
    const password = String(body.password || '');
    const role = String(body.role || 'admin').trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters',
        },
        { status: 400 }
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid administrator role' },
        { status: 400 }
      );
    }

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { success: false, error: lookupError.message },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An administrator with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data, error } = await supabaseAdmin
      .from('admins')
      .insert({
        email,
        password_hash: passwordHash,
        role,
        is_active: true,
      })
      .select(
        'id, email, role, is_active, created_at, updated_at, last_login_at'
      )
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
        message: 'Administrator created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Invalid request',
      },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const admin = await getAuthorizedAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Super administrator access required' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const id = String(body.id || '').trim();
    const email =
      body.email !== undefined ? cleanEmail(body.email) : undefined;
    const role =
      body.role !== undefined ? String(body.role).trim() : undefined;
    const isActive =
      body.is_active !== undefined ? Boolean(body.is_active) : undefined;
    const password =
      body.password !== undefined ? String(body.password) : undefined;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Administrator id is required' },
        { status: 400 }
      );
    }

    if (id === admin.id && isActive === false) {
      return NextResponse.json(
        { success: false, error: 'You cannot deactivate your own account' },
        { status: 400 }
      );
    }

    if (role !== undefined && !isValidRole(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid administrator role' },
        { status: 400 }
      );
    }

    if (password !== undefined && password.length > 0 && password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters',
        },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (email !== undefined) {
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { success: false, error: 'Invalid email address' },
          { status: 400 }
        );
      }

      updates.email = email;
    }

    if (role !== undefined) {
      updates.role = role;
    }

    if (isActive !== undefined) {
      updates.is_active = isActive;
    }

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 12);
    }

    const { data, error } = await supabaseAdmin
      .from('admins')
      .update(updates)
      .eq('id', id)
      .select(
        'id, email, role, is_active, created_at, updated_at, last_login_at'
      )
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || 'Administrator not found',
        },
        { status: error ? 500 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Administrator updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Invalid request',
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const admin = await getAuthorizedAdmin(request);

  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Super administrator access required' },
      { status: 403 }
    );
  }

  const id = new URL(request.url).searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Administrator id is required' },
      { status: 400 }
    );
  }

  if (id === admin.id) {
    return NextResponse.json(
      { success: false, error: 'You cannot delete your own account' },
      { status: 400 }
    );
  }

  const { data: target, error: targetError } = await supabaseAdmin
    .from('admins')
    .select('id, role')
    .eq('id', id)
    .maybeSingle();

  if (targetError) {
    return NextResponse.json(
      { success: false, error: targetError.message },
      { status: 500 }
    );
  }

  if (!target) {
    return NextResponse.json(
      { success: false, error: 'Administrator not found' },
      { status: 404 }
    );
  }

  if (target.role === 'super_admin') {
    const { count, error: countError } = await supabaseAdmin
      .from('admins')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'super_admin')
      .eq('is_active', true);

    if (countError) {
      return NextResponse.json(
        { success: false, error: countError.message },
        { status: 500 }
      );
    }

    if ((count || 0) <= 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'The last active super administrator cannot be deleted',
        },
        { status: 400 }
      );
    }
  }

  const { error } = await supabaseAdmin
    .from('admins')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Administrator deleted successfully',
  });
}
