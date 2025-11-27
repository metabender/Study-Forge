import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// Validate critical environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Google OAuth credentials not configured. Sign-in will not work.');
}

// Determine the application URL
const getAppUrl = (): string => {
  // 1. Use NEXTAUTH_URL if explicitly set
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // 2. Use Railway public domain in production
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }

  // 3. Use Vercel URL if deployed on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 4. Fallback to localhost for development
  return `http://localhost:${process.env.PORT || 3000}`;
};

const APP_URL = getAppUrl();
console.log('🔐 NextAuth configured with URL:', APP_URL);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'not-configured',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'not-configured',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;

        // Check if user has Google tokens
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { googleAccessToken: true, googleRefreshToken: true },
        });

        session.user.hasGoogleCalendar = !!(dbUser?.googleAccessToken && dbUser?.googleRefreshToken);
      }
      return session;
    },
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            const tokenExpiry = new Date();
            tokenExpiry.setSeconds(tokenExpiry.getSeconds() + (account.expires_at || 3600));

            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: account.providerAccountId,
                googleAccessToken: account.access_token,
                googleRefreshToken: account.refresh_token || existingUser.googleRefreshToken,
                googleTokenExpiry: tokenExpiry,
              },
            });
          }
          return true;
        } catch (error) {
          console.error('Error storing Google tokens:', error);
          return false;
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/',
    error: '/', // Error code passed in query string as ?error=
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
};
