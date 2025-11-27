import { Assignment } from './types';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new APIError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Get all assignments
  async getAssignments(): Promise<Assignment[]> {
    const data = await fetchAPI('/api/assignments');
    return data.assignments;
  },

  // Create a new assignment
  async createAssignment(assignment: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    const data = await fetchAPI('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
    return data.assignment;
  },

  // Delete an assignment
  async deleteAssignment(id: string): Promise<void> {
    await fetchAPI(`/api/assignments/${id}`, {
      method: 'DELETE',
    });
  },

  // Sync assignment to Google Calendar
  async syncToCalendar(id: string): Promise<{ eventId: string; assignment: Assignment }> {
    const data = await fetchAPI(`/api/assignments/${id}/sync`, {
      method: 'POST',
    });
    return data;
  },

  // Check Google Calendar connection status
  async getCalendarStatus(): Promise<{ connected: boolean; email: string | null }> {
    const data = await fetchAPI('/api/calendar/status');
    return data;
  },
};
