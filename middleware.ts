import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_ROLES = new Set(['admin', 'super_admin']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Login page must remain public.
  if (pathname === '/admin/signin') {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token?.role && ADMIN_ROLES.has(String(token.role))) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role ? String(token.role) : null;

  if (!token || !role || !ADMIN_ROLES.has(role)) {
    // API clients should receive JSON instead of an HTML redirect.
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const signInUrl = new URL('/admin/signin', req.url);
    signInUrl.searchParams.set('from', pathname);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
