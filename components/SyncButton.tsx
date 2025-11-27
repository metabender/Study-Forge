'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { api, APIError } from '@/lib/api';

interface SyncButtonProps {
  assignmentId: string;
  isSynced: boolean;
  onSyncSuccess: (eventId: string) => void;
}

export default function SyncButton({ assignmentId, isSynced, onSyncSuccess }: SyncButtonProps) {
  const { data: session } = useSession();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    if (!session) {
      setError('Please sign in to sync to Google Calendar');
      return;
    }

    setSyncing(true);
    setError(null);

    try {
      const result = await api.syncToCalendar(assignmentId);
      onSyncSuccess(result.eventId);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to sync to calendar');
      }
    } finally {
      setSyncing(false);
    }
  };

  if (isSynced) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Synced
      </div>
    );
  }

  return (
    <div className="inline-block">
      <button
        onClick={handleSync}
        disabled={syncing || !session}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title={!session ? 'Sign in to sync to Google Calendar' : 'Sync to Google Calendar'}
      >
        {syncing ? (
          <>
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Syncing...
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Sync to Calendar
          </>
        )}
      </button>
      {error && (
        <div className="mt-1 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
