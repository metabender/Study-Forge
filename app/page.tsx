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
    <main className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block mb-6">
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                StudyForge
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg blur-xl opacity-20 -z-10"></div>
            </div>
          </div>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Transform your homework chaos into an optimized 7-day study plan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
          <div>
            <HomeworkForm onAdd={handleAddAssignment} />
          </div>

          <div>
            <AssignmentList assignments={assignments} onDelete={handleDeleteAssignment} />
          </div>
        </div>

        {assignments.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="relative group w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <span className="relative flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating AI Plan...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate 7-Day Plan
                  </>
                )}
              </span>
            </button>

            <button
              onClick={handleClearAll}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/plan')}
            className="group inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View Current Study Plan</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
