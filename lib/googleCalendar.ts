import { google } from 'googleapis';
import { prisma } from './prisma';
import { parseLocalDate } from './dateUtils';

export interface CalendarEventData {
  title: string;
  subject: string;
  dueDate: string;
  timeEstimate: number;
  notes?: string;
  difficulty: string;
}

async function getAuthClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
    },
  });

  if (!user?.googleAccessToken || !user?.googleRefreshToken) {
    throw new Error('User not authenticated with Google Calendar');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  );

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  // Check if token is expired and refresh if needed
  if (user.googleTokenExpiry && new Date() >= user.googleTokenExpiry) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();

      const newExpiry = new Date();
      newExpiry.setSeconds(newExpiry.getSeconds() + (credentials.expiry_date || 3600) / 1000);

      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: credentials.access_token,
          googleRefreshToken: credentials.refresh_token || user.googleRefreshToken,
          googleTokenExpiry: newExpiry,
        },
      });

      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh Google token. Please re-authenticate.');
    }
  }

  return oauth2Client;
}

export async function createCalendarEvent(userId: string, eventData: CalendarEventData): Promise<string> {
  const auth = await getAuthClient(userId);
  const calendar = google.calendar({ version: 'v3', auth });

  const dueDate = parseLocalDate(eventData.dueDate);

  // Create an all-day event on the due date
  const event = {
    summary: `${eventData.subject}: ${eventData.title}`,
    description: `
📚 StudyForge Assignment

Subject: ${eventData.subject}
Difficulty: ${eventData.difficulty}
Estimated Time: ${eventData.timeEstimate} minutes

${eventData.notes ? `Notes:\n${eventData.notes}` : ''}

Created by StudyForge AI Homework Planner
    `.trim(),
    start: {
      date: eventData.dueDate,
      timeZone: 'America/New_York',
    },
    end: {
      date: eventData.dueDate,
      timeZone: 'America/New_York',
    },
    colorId: eventData.difficulty === 'Hard' ? '11' : eventData.difficulty === 'Medium' ? '5' : '2',
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 60 }, // 1 hour before (on due day)
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    if (!response.data.id) {
      throw new Error('No event ID returned from Google Calendar');
    }

    return response.data.id;
  } catch (error: any) {
    console.error('Calendar event creation error:', error);
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
}

export async function deleteCalendarEvent(userId: string, eventId: string): Promise<void> {
  const auth = await getAuthClient(userId);
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  } catch (error: any) {
    console.error('Calendar event deletion error:', error);
    // Don't throw error if event not found - it might have been deleted manually
    if (error.code !== 404 && error.code !== 410) {
      throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
  }
}

export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  eventData: CalendarEventData
): Promise<void> {
  const auth = await getAuthClient(userId);
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: `${eventData.subject}: ${eventData.title}`,
    description: `
📚 StudyForge Assignment

Subject: ${eventData.subject}
Difficulty: ${eventData.difficulty}
Estimated Time: ${eventData.timeEstimate} minutes

${eventData.notes ? `Notes:\n${eventData.notes}` : ''}

Created by StudyForge AI Homework Planner
    `.trim(),
    start: {
      date: eventData.dueDate,
      timeZone: 'America/New_York',
    },
    end: {
      date: eventData.dueDate,
      timeZone: 'America/New_York',
    },
    colorId: eventData.difficulty === 'Hard' ? '11' : eventData.difficulty === 'Medium' ? '5' : '2',
  };

  try {
    await calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: event,
    });
  } catch (error: any) {
    console.error('Calendar event update error:', error);
    throw new Error(`Failed to update calendar event: ${error.message}`);
  }
}
