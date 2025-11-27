'use client';

import { Assignment } from '@/lib/types';

interface AssignmentListProps {
  assignments: Assignment[];
  onDelete: (id: string) => void;
}

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-300 border border-green-500/50',
  Medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
  Hard: 'bg-red-500/20 text-red-300 border border-red-500/50',
};

export default function AssignmentList({ assignments, onDelete }: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4 animate-float">📚</div>
        <p className="text-gray-400 text-lg">No assignments yet</p>
        <p className="text-gray-500 text-sm mt-2">Add your first homework above to get started</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDue = (dateString: string) => {
    const now = new Date();
    const due = new Date(dateString);
    const days = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-space-accent to-space-glow mb-4">
        Your Assignments ({assignments.length})
      </h2>

      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="card group hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-1">{assignment.title}</h3>
              <p className="text-space-glow text-sm font-medium">{assignment.subject}</p>
            </div>
            <button
              onClick={() => onDelete(assignment.id)}
              className="text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 ml-4"
              aria-label="Delete assignment"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`difficulty-badge ${difficultyColors[assignment.difficulty]}`}>
              {assignment.difficulty}
            </span>
            <span className="difficulty-badge bg-blue-500/20 text-blue-300 border border-blue-500/50">
              {assignment.timeEstimate} min
            </span>
            <span className="difficulty-badge bg-purple-500/20 text-purple-300 border border-purple-500/50">
              {getDaysUntilDue(assignment.dueDate)}
            </span>
          </div>

          <div className="text-sm text-gray-400 mb-2">
            Due: {formatDate(assignment.dueDate)}
          </div>

          {assignment.notes && (
            <p className="text-sm text-gray-300 mt-2 p-3 bg-space-dark/50 rounded-lg border border-space-light/30">
              {assignment.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
