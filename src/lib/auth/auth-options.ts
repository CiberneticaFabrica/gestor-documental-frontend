import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          console.log('User from API:', user);

          if (user) {
            return {
              id: user.userId,
              name: user.name,
              email: user.email,
              roles: user.roles,
              permissions: user.permissions,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
            };
          }

          return null;
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Token:', token);
      console.log('JWT Callback - User:', user);

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Token:', token);
      console.log('Session Callback - Session:', session);

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};