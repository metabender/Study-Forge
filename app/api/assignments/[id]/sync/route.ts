import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { createCalendarEvent } from '@/lib/googleCalendar';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    if (assignment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (assignment.googleEventId) {
      return NextResponse.json(
        { error: 'Assignment already synced to Google Calendar' },
        { status: 400 }
      );
    }

    // Check if user has Google Calendar connected
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { googleAccessToken: true, googleRefreshToken: true },
    });

    if (!user?.googleAccessToken || !user?.googleRefreshToken) {
      return NextResponse.json(
        { error: 'Google Calendar not connected. Please connect your calendar first.' },
        { status: 400 }
      );
    }

    // Create Google Calendar event
    const eventId = await createCalendarEvent(session.user.id, {
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      timeEstimate: assignment.timeEstimate,
      notes: assignment.notes || undefined,
      difficulty: assignment.difficulty,
    });

    // Update assignment with Google event ID
    const updatedAssignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        googleEventId: eventId,
        syncedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      assignment: updatedAssignment,
      eventId,
    });
  } catch (error: any) {
    console.error('Error syncing to Google Calendar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync to Google Calendar' },
      { status: 500 }
    );
  }
}
