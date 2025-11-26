// Export all types from a single entry point
export * from './user';
export * from './pedagogical-project';
export * from './team-management';
export * from './content-production';

// Legacy types for backward compatibility
export interface Course {
  id: string;
  name: string;
  description: string;
  syllabus: string; // Ementa
  workload: number; // Carga horária em horas
  expirationDate: Date | string; // Data de expiração
  completion: number; // 0-100 (calculado baseado nos checkboxes)
  checklist?: ChecklistItem[];
  createdAt: Date | string;
  expanded?: boolean;
}

export enum TrainingType {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  FULLSTACK = 'Fullstack',
  DEVOPS = 'DevOps',
  MOBILE = 'Mobile',
  DATA_SCIENCE = 'Data Science',
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface UsefulLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  addedAt?: Date | string;
}

export interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: Date | string;
  author?: string;
  createdAt?: Date | string;
}

export interface ActionHistory {
  id: string;
  action: string;
  user: string;
  details?: string;
  timestamp: Date | string;
}

export type FilterPeriod = 'all' | 'week' | 'month' | 'quarter';

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: LibraryCategory;
  tags: string[];
  url?: string;
  author?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  addedBy?: string;
  addedAt?: Date | string;
}

export enum LibraryCategory {
  DOCUMENTATION = 'Documentation',
  TOOL = 'Tool',
  TEMPLATE = 'Template',
  RESOURCE = 'Resource',
  GUIDE = 'Guide',
  ARTICLE = 'Article',
}
