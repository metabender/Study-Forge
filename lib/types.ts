export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  difficulty: DifficultyLevel;
  timeEstimate: number;
  dueDate: string;
  notes: string;
  createdAt: string;
}

export interface DailyTask {
  id: string;
  title: string;
  subject: string;
  timeEstimate: number;
  difficulty: DifficultyLevel;
  originalAssignmentId: string;
}

export interface StudyPlan {
  Monday: DailyTask[];
  Tuesday: DailyTask[];
  Wednesday: DailyTask[];
  Thursday: DailyTask[];
  Friday: DailyTask[];
  Saturday: DailyTask[];
  Sunday: DailyTask[];
}

export type DayOfWeek = keyof StudyPlan;
