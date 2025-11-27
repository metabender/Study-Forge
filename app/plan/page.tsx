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
    <main className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-indigo-500/50 hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Assignments
          </button>

          <button
            onClick={handleClearPlan}
            className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
          >
            Clear Plan
          </button>
        </div>

        <StudyPlanGrid plan={studyPlan} />

        <div className="mt-16 flex justify-center">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-8 max-w-2xl w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.1),transparent)]"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                Study Tips
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3 group">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/30 group-hover:scale-110 transition-transform">✓</span>
                  <span className="leading-relaxed">Harder tasks are scheduled earlier when you're most focused</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/30 group-hover:scale-110 transition-transform">✓</span>
                  <span className="leading-relaxed">Urgent deadlines are prioritized automatically</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/30 group-hover:scale-110 transition-transform">✓</span>
                  <span className="leading-relaxed">Workload is balanced across all 7 days for optimal pacing</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/30 group-hover:scale-110 transition-transform">✓</span>
                  <span className="leading-relaxed">Review and adjust your plan as you complete tasks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
