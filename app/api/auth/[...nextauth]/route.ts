import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
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
  },
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
