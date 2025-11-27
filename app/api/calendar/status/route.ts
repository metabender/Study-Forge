import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ connected: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        email: true,
      },
    });

    const connected = !!(user?.googleAccessToken && user?.googleRefreshToken);

    return NextResponse.json({
      connected,
      email: connected ? user?.email : null,
    });
  } catch (error: any) {
    console.error('Error checking calendar status:', error);
    return NextResponse.json({ connected: false });
  }
}
