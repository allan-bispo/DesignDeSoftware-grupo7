export type TrainingType = 'Frontend' | 'Backend' | 'Fullstack' | 'DevOps' | 'Mobile' | 'Data Science';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface UsefulLink {
  id: string;
  title: string;
  url: string;
  addedAt: Date;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface ActionHistory {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  responsible: string;
  trainingType: TrainingType;
  completion: number;
  deliveryDate: Date;
  duration: string;
  modules: number;
  projectNotes: string;
  checklist: ChecklistItem[];
  expanded?: boolean;
  usefulLinks?: UsefulLink[];
  comments?: Comment[];
  actionHistory?: ActionHistory[];
}

export type FilterPeriod = 'Week' | 'Month' | 'Quarter' | 'Year';
export type FilterFeedback = 'All' | 'Pending' | 'Completed';
