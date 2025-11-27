'use client';

import { Assignment } from '@/lib/types';
import { formatDate, formatDaysUntilDue, getDaysUntilDue } from '@/lib/dateUtils';

interface AssignmentListProps {
  assignments: Assignment[];
  onDelete: (id: string) => void;
}

const difficultyColors = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

const difficultyIcons = {
  Easy: '○',
  Medium: '◐',
  Hard: '●',
};

export default function AssignmentList({ assignments, onDelete }: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="relative">
          <div className="text-7xl mb-6 inline-block animate-float">📚</div>
          <h3 className="text-xl font-semibold text-slate-200 mb-2">No assignments yet</h3>
          <p className="text-slate-400">Add your first homework to get started with your study plan</p>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (dateString: string) => {
    const days = getDaysUntilDue(dateString);
    if (days < 0) return 'text-red-400';
    if (days === 0) return 'text-orange-400';
    if (days <= 2) return 'text-yellow-400';
    return 'text-slate-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Assignments
        </h2>
        <span className="text-sm px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {assignments.length} {assignments.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-indigo-300 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-indigo-400 font-medium">{assignment.subject}</p>
                </div>

                <button
                  onClick={() => onDelete(assignment.id)}
                  className="shrink-0 w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Delete assignment"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${difficultyColors[assignment.difficulty]}`}>
                  <span className="text-sm">{difficultyIcons[assignment.difficulty]}</span>
                  {assignment.difficulty}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {assignment.timeEstimate} min
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getUrgencyColor(assignment.dueDate)} bg-slate-800/50 border border-slate-700/50`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDaysUntilDue(assignment.dueDate)}
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Due: <span className="text-slate-400">{formatDate(assignment.dueDate)}</span>
              </div>

              {assignment.notes && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950/50 border border-slate-700/30">
                  <p className="text-sm text-slate-300 leading-relaxed">{assignment.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
