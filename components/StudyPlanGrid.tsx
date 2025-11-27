'use client';

import { StudyPlan, DayOfWeek, DailyTask } from '@/lib/types';

interface StudyPlanGridProps {
  plan: StudyPlan;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

const dayColors = [
  'from-indigo-500/20',
  'from-purple-500/20',
  'from-pink-500/20',
  'from-rose-500/20',
  'from-orange-500/20',
  'from-amber-500/20',
  'from-yellow-500/20',
];

export default function StudyPlanGrid({ plan }: StudyPlanGridProps) {
  const getTotalTime = (tasks: DailyTask[]) => {
    return tasks.reduce((sum, task) => sum + task.timeEstimate, 0);
  };

  const isEmpty = DAYS.every(day => plan[day].length === 0);

  if (isEmpty) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent)]"></div>
        <div className="relative">
          <div className="text-9xl mb-8 inline-block animate-float">🎯</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            No Study Plan Yet
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Add some assignments and generate your personalized 7-day study plan optimized by AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          Your 7-Day Study Plan
        </h1>
        <p className="text-slate-400 text-lg">Optimized by difficulty and urgency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {DAYS.map((day, index) => {
          const tasks = plan[day];
          const totalTime = getTotalTime(tasks);
          const hours = Math.floor(totalTime / 60);
          const minutes = totalTime % 60;

          return (
            <div
              key={day}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${dayColors[index]} to-transparent opacity-50`}></div>

              <div className="relative p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {day}
                  </h2>
                  <span className="text-2xl">{index === 0 ? '🌙' : index === 1 ? '🌟' : index === 2 ? '🪐' : index === 3 ? '✨' : index === 4 ? '🌠' : index === 5 ? '🚀' : '☄️'}</span>
                </div>

                {tasks.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">😌</div>
                    <p className="text-sm text-slate-400">Free day!</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-3 rounded-lg bg-slate-950/50 border border-slate-700/30">
                      <div className="text-xs text-slate-500 mb-1">Total Time</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {hours > 0 && `${hours}h `}{minutes}m
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3.5 bg-slate-950/30 rounded-lg border border-slate-700/40 hover:border-indigo-500/50 transition-all duration-300 group/task"
                        >
                          <h3 className="font-semibold text-white text-sm mb-1.5 group-hover/task:text-indigo-300 transition-colors line-clamp-2">
                            {task.title}
                          </h3>
                          <p className="text-xs text-slate-400 mb-2.5">{task.subject}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border ${difficultyColors[task.difficulty]}`}>
                              <span>{difficultyIcons[task.difficulty]}</span>
                              {task.difficulty}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {task.timeEstimate}m
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
