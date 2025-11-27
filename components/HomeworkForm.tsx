'use client';

import { useState } from 'react';
import { Assignment, DifficultyLevel } from '@/lib/types';

interface HomeworkFormProps {
  onAdd: (assignment: Assignment) => void;
}

export default function HomeworkForm({ onAdd }: HomeworkFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [timeEstimate, setTimeEstimate] = useState('60');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !subject || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newAssignment: Assignment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      subject,
      difficulty,
      timeEstimate: parseInt(timeEstimate) || 60,
      dueDate,
      notes,
      createdAt: new Date().toISOString(),
    };

    onAdd(newAssignment);

    setTitle('');
    setSubject('');
    setDifficulty('Medium');
    setTimeEstimate('60');
    setDueDate('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-6 space-y-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.1),transparent)]"></div>

      <div className="relative">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          Add Assignment
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Math Chapter 5 Problems"
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Subject <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Difficulty <span className="text-rose-400">*</span>
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 cursor-pointer"
                required
              >
                <option value="Easy">○ Easy</option>
                <option value="Medium">◐ Medium</option>
                <option value="Hard">● Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Time (min) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                placeholder="60"
                min="1"
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Due Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Notes <span className="text-slate-500">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Assignment
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
