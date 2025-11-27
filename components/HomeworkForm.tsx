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
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-space-accent to-space-glow">
        Add Homework
      </h2>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Math Chapter 5 Problems"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Subject <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Mathematics"
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Difficulty <span className="text-red-400">*</span>
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
            className="input-field"
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Time Estimate (minutes) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(e.target.value)}
            placeholder="60"
            min="1"
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Due Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional details..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Add Assignment
      </button>
    </form>
  );
}
