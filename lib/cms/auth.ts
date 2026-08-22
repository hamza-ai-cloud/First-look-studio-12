import { getToken } from 'next-auth/jwt';

export type CmsRole = 'admin' | 'super_admin';

export async function getCmsAdmin(request: Request) {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role ? String(token.role) : '';

  if (role !== 'admin' && role !== 'super_admin') {
    return null;
  }

  return {
    id: token?.sub ? String(token.sub) : null,
    email: token?.email ? String(token.email) : null,
    role: role as CmsRole,
  };
}

export async function requireCmsAdmin(request: Request) {
  const admin = await getCmsAdmin(request);

  if (!admin) {
    return {
      authorized: false as const,
      admin: null,
    };
  }

  return {
    authorized: true as const,
    admin,
  };
}

export async function requireSuperAdmin(request: Request) {
  const admin = await getCmsAdmin(request);

  if (!admin || admin.role !== 'super_admin') {
    return {
      authorized: false as const,
      admin: null,
    };
  }

  return {
    authorized: true as const,
    admin,
  };
}


export async function requireContentAdmin(request: Request) {
  const admin = await getCmsAdmin(request);

  if (!admin || (admin.role !== 'admin' && admin.role !== 'super_admin')) {
    return {
      authorized: false as const,
      admin: null,
    };
  }

  return {
    authorized: true as const,
    admin,
  };
}
