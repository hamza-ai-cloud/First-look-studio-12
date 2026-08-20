import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { supabaseAdmin } from './supabaseAdmin';

type AdminRole = 'admin' | 'super_admin';

interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  role: string | null;
}

function isAdminRole(role: string | null | undefined): role is AdminRole {
  return role === 'admin' || role === 'super_admin';
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        if (!email || !password) {
          return null;
        }

        const { data, error } = await supabaseAdmin
          .from('admins')
          .select('id, email, password_hash, role')
          .eq('email', email)
          .maybeSingle();

        if (error || !data) {
          return null;
        }

        const admin = data as AdminUser;

        if (!admin.password_hash) {
          return null;
        }

        if (!isAdminRole(admin.role)) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          password,
          admin.password_hash
        );

        if (!passwordValid) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: 'Admin',
          role: admin.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as { role?: string }).role || 'admin';
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email || session.user.email;

        (session.user as typeof session.user & {
          id?: string;
          role?: string;
        }).id = token.id as string | undefined;

        (session.user as typeof session.user & {
          id?: string;
          role?: string;
        }).role = token.role as string | undefined;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/admin/signin',
  },
};

export default NextAuth(authOptions);
