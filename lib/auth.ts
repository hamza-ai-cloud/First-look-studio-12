import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './mongodb';
import bcrypt from 'bcryptjs';
import { seedAdminFromEnv } from './seedAdmin';

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
        if (!credentials) return null;

        // Ensure initial admin exists if env seed provided
        await seedAdminFromEnv();

        const { db } = await connectToDatabase();
        const user = await db.collection('admins').findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;

        const ok = await bcrypt.compare(credentials.password, user.passwordHash as string);
        if (!ok) return null;

        return { id: user._id.toString(), email: user.email, name: 'Admin', role: user.role || 'admin' } as any;
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
      (session as any).user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
