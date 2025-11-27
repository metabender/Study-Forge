'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomeworkForm from '@/components/HomeworkForm';
import AssignmentList from '@/components/AssignmentList';
import { Assignment } from '@/lib/types';
import { storageUtils } from '@/lib/storage';
import { generateStudyPlan } from '@/lib/studyPlanGenerator';

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadedAssignments = storageUtils.getAssignments();
    setAssignments(loadedAssignments);
  }, []);

  const handleAddAssignment = (assignment: Assignment) => {
    storageUtils.addAssignment(assignment);
    setAssignments(storageUtils.getAssignments());
  };

  const handleDeleteAssignment = (id: string) => {
    storageUtils.deleteAssignment(id);
    setAssignments(storageUtils.getAssignments());
  };

  const handleGeneratePlan = () => {
    if (assignments.length === 0) {
      alert('Please add at least one assignment before generating a study plan');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const plan = generateStudyPlan(assignments);
      storageUtils.saveStudyPlan(plan);
      setIsGenerating(false);
      router.push('/plan');
    }, 800);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all assignments?')) {
      storageUtils.clearAll();
      setAssignments([]);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-space-accent to-space-glow mb-3 animate-glow">
            ✨ StudyForge
          </h1>
          <p className="text-xl text-gray-400">Turn chaos into a 7-day study plan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <HomeworkForm onAdd={handleAddAssignment} />
          </div>

          <div>
            <AssignmentList assignments={assignments} onDelete={handleDeleteAssignment} />
          </div>
        </div>

        {assignments.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px]"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                '🚀 Generate 7-Day Plan'
              )}
            </button>

            <button
              onClick={handleClearAll}
              className="btn-secondary"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/plan')}
            className="text-space-glow hover:text-space-accent transition-colors underline"
          >
            View Current Study Plan →
          </button>
        </div>
      </div>
    </main>
  );
}
