import { Assignment, StudyPlan } from './types';

const ASSIGNMENTS_KEY = 'studyforge_assignments';
const STUDY_PLAN_KEY = 'studyforge_study_plan';

export const storageUtils = {
  getAssignments: (): Assignment[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ASSIGNMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading assignments:', error);
      return [];
    }
  },

  saveAssignments: (assignments: Assignment[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
    } catch (error) {
      console.error('Error saving assignments:', error);
    }
  },

  addAssignment: (assignment: Assignment): void => {
    const assignments = storageUtils.getAssignments();
    assignments.push(assignment);
    storageUtils.saveAssignments(assignments);
  },

  deleteAssignment: (id: string): void => {
    const assignments = storageUtils.getAssignments();
    const filtered = assignments.filter(a => a.id !== id);
    storageUtils.saveAssignments(filtered);
  },

  getStudyPlan: (): StudyPlan | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STUDY_PLAN_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading study plan:', error);
      return null;
    }
  },

  saveStudyPlan: (plan: StudyPlan): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STUDY_PLAN_KEY, JSON.stringify(plan));
    } catch (error) {
      console.error('Error saving study plan:', error);
    }
  },

  clearStudyPlan: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STUDY_PLAN_KEY);
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ASSIGNMENTS_KEY);
    localStorage.removeItem(STUDY_PLAN_KEY);
  }
};
