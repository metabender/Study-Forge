'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudyPlanGrid from '@/components/StudyPlanGrid';
import { StudyPlan } from '@/lib/types';
import { storageUtils } from '@/lib/storage';

const emptyPlan: StudyPlan = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

export default function PlanPage() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(emptyPlan);
  const router = useRouter();

  useEffect(() => {
    const loadedPlan = storageUtils.getStudyPlan();
    if (loadedPlan) {
      setStudyPlan(loadedPlan);
    }
  }, []);

  const handleClearPlan = () => {
    if (confirm('Are you sure you want to clear your study plan?')) {
      storageUtils.clearStudyPlan();
      setStudyPlan(emptyPlan);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Assignments
          </button>

          <button
            onClick={handleClearPlan}
            className="btn-secondary text-red-400 border-red-500/50 hover:border-red-400"
          >
            Clear Plan
          </button>
        </div>

        <StudyPlanGrid plan={studyPlan} />

        <div className="mt-12 text-center">
          <div className="card inline-block">
            <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-space-accent to-space-glow">
              Tips for Success
            </h3>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-space-glow">✓</span>
                <span>Harder tasks are scheduled earlier when you're most focused</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-space-glow">✓</span>
                <span>Urgent deadlines are prioritized automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-space-glow">✓</span>
                <span>Workload is balanced across all 7 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-space-glow">✓</span>
                <span>Check off tasks as you complete them each day</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
