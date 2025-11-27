import { Assignment, StudyPlan, DailyTask, DayOfWeek } from './types';
import { getDaysUntilDue } from './dateUtils';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const difficultyScore = (difficulty: string): number => {
  switch (difficulty) {
    case 'Hard': return 3;
    case 'Medium': return 2;
    case 'Easy': return 1;
    default: return 1;
  }
};

const calculateUrgency = (dueDate: string): number => {
  const daysUntilDue = getDaysUntilDue(dueDate);

  if (daysUntilDue <= 1) return 10;
  if (daysUntilDue <= 2) return 8;
  if (daysUntilDue <= 3) return 6;
  if (daysUntilDue <= 5) return 4;
  if (daysUntilDue <= 7) return 2;
  return 1;
};

const calculatePriority = (assignment: Assignment): number => {
  const urgency = calculateUrgency(assignment.dueDate);
  const difficulty = difficultyScore(assignment.difficulty);
  return (urgency * 2) + (difficulty * 1.5);
};

export const generateStudyPlan = (assignments: Assignment[]): StudyPlan => {
  const plan: StudyPlan = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  if (assignments.length === 0) {
    return plan;
  }

  const sortedAssignments = [...assignments].sort((a, b) => {
    const priorityA = calculatePriority(a);
    const priorityB = calculatePriority(b);

    if (Math.abs(priorityA - priorityB) < 0.1) {
      return difficultyScore(b.difficulty) - difficultyScore(a.difficulty);
    }

    return priorityB - priorityA;
  });

  const dailyWorkload: Record<DayOfWeek, number> = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  const createDailyTask = (assignment: Assignment): DailyTask => ({
    id: `task-${assignment.id}-${Date.now()}-${Math.random()}`,
    title: assignment.title,
    subject: assignment.subject,
    timeEstimate: assignment.timeEstimate,
    difficulty: assignment.difficulty,
    originalAssignmentId: assignment.id,
  });

  sortedAssignments.forEach(assignment => {
    const daysUntilDue = getDaysUntilDue(assignment.dueDate);

    let targetDayIndex = 0;

    if (daysUntilDue <= 1) {
      targetDayIndex = 0;
    } else if (daysUntilDue <= 2) {
      targetDayIndex = 0;
    } else if (daysUntilDue <= 3) {
      targetDayIndex = 1;
    } else if (daysUntilDue <= 5) {
      targetDayIndex = 2;
    } else {
      const lightestDay = DAYS.reduce((lightest, day, index) => {
        return dailyWorkload[day] < dailyWorkload[DAYS[lightest]] ? index : lightest;
      }, 0);

      targetDayIndex = lightestDay;
    }

    const maxWorkloadPerDay = 180;
    let assigned = false;

    for (let attempt = 0; attempt < DAYS.length && !assigned; attempt++) {
      const dayIndex = (targetDayIndex + attempt) % DAYS.length;
      const day = DAYS[dayIndex];

      if (dailyWorkload[day] + assignment.timeEstimate <= maxWorkloadPerDay) {
        plan[day].push(createDailyTask(assignment));
        dailyWorkload[day] += assignment.timeEstimate;
        assigned = true;
      }
    }

    if (!assigned) {
      const lightestDay = DAYS.reduce((lightest, day) => {
        return dailyWorkload[day] < dailyWorkload[lightest] ? day : lightest;
      }, DAYS[0]);

      plan[lightestDay].push(createDailyTask(assignment));
      dailyWorkload[lightestDay] += assignment.timeEstimate;
    }
  });

  DAYS.forEach(day => {
    plan[day].sort((a, b) => difficultyScore(b.difficulty) - difficultyScore(a.difficulty));
  });

  return plan;
};
