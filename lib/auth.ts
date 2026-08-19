import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from './supabaseAdmin';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        const { data: user, error } = await supabaseAdmin
          .from('admins')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (error || !user) {
          return null;
        }

        const passwordHash =
          user.password_hash || user.passwordHash;

        if (!passwordHash) {
          return null;
        }

        const ok = await bcrypt.compare(
          credentials.password,
          passwordHash
        );

        if (!ok) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: 'Admin',
          role: user.role || 'admin',
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'admin';
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
