'use client';

import { StudyPlan, DayOfWeek, DailyTask } from '@/lib/types';

interface StudyPlanGridProps {
  plan: StudyPlan;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-300 border-green-500/50',
  Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  Hard: 'bg-red-500/20 text-red-300 border-red-500/50',
};

const dayEmojis: Record<DayOfWeek, string> = {
  Monday: '🌙',
  Tuesday: '🌟',
  Wednesday: '🪐',
  Thursday: '✨',
  Friday: '🌠',
  Saturday: '🚀',
  Sunday: '☄️',
};

export default function StudyPlanGrid({ plan }: StudyPlanGridProps) {
  const getTotalTime = (tasks: DailyTask[]) => {
    return tasks.reduce((sum, task) => sum + task.timeEstimate, 0);
  };

  const isEmpty = DAYS.every(day => plan[day].length === 0);

  if (isEmpty) {
    return (
      <div className="card text-center py-16">
        <div className="text-8xl mb-6 animate-float">🎯</div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-space-accent to-space-glow mb-4">
          No Study Plan Yet
        </h2>
        <p className="text-gray-400 text-lg">
          Add some assignments and generate your personalized 7-day study plan
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-space-accent to-space-glow mb-2 animate-glow">
          Your 7-Day Study Plan
        </h1>
        <p className="text-gray-400">Optimized by difficulty and urgency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DAYS.map((day, index) => {
          const tasks = plan[day];
          const totalTime = getTotalTime(tasks);

          return (
            <div
              key={day}
              className="card hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">{dayEmojis[day]}</span>
                  {day}
                </h2>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">😌</div>
                  <p className="text-sm">Free day!</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-space-dark/50 rounded-lg border border-space-light/30">
                    <div className="text-sm text-gray-400">Total Time</div>
                    <div className="text-xl font-bold text-space-glow">{totalTime} min</div>
                    <div className="text-xs text-gray-500">{Math.round(totalTime / 60 * 10) / 10} hours</div>
                  </div>

                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-space-dark/30 rounded-lg border border-space-light/40 hover:border-space-glow/50 transition-all duration-300 group"
                      >
                        <h3 className="font-semibold text-white mb-2 group-hover:text-space-glow transition-colors">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{task.subject}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[task.difficulty]}`}>
                            {task.difficulty}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50">
                            {task.timeEstimate} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
