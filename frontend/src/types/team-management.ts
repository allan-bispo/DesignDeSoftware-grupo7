import { User } from './user';
import { Microcourse } from './pedagogical-project';

export enum TeamType {
  PRODUCTION = 'producao',
  PEDAGOGICAL = 'pedagogico',
  TUTORING = 'tutoria',
  COORDINATION = 'coordenacao',
  SUPPORT = 'suporte',
}

export enum TaskType {
  CONTENT_WRITING = 'escrita_conteudo',
  ILLUSTRATION = 'ilustracao',
  VIDEO_PRODUCTION = 'producao_video',
  REVIEW = 'revisao',
  TRANSLATION = 'traducao',
  QUIZ_CREATION = 'criacao_quiz',
  FORUM_MODERATION = 'moderacao_forum',
  TUTORING = 'tutoria',
  VALIDATION = 'validacao',
  OTHER = 'outro',
}

export enum TaskStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  UNDER_REVIEW = 'em_revisao',
  COMPLETED = 'concluido',
  CANCELLED = 'cancelado',
}

export enum TaskPriority {
  LOW = 'baixa',
  MEDIUM = 'media',
  HIGH = 'alta',
  URGENT = 'urgente',
}

export interface TeamMember {
  id: string;
  user: User;
  role?: string;
  responsibilities?: string;
  joinedAt?: string;
  leftAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  type: TeamType;
  leader?: User;
  microcourse?: Microcourse;
  members?: TeamMember[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignment {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: User;
  createdBy?: User;
  microcourse?: Microcourse;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  attachments?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export const TeamTypeLabels: Record<TeamType, string> = {
  [TeamType.PRODUCTION]: 'Produção',
  [TeamType.PEDAGOGICAL]: 'Pedagógico',
  [TeamType.TUTORING]: 'Tutoria',
  [TeamType.COORDINATION]: 'Coordenação',
  [TeamType.SUPPORT]: 'Suporte',
};

export const TaskTypeLabels: Record<TaskType, string> = {
  [TaskType.CONTENT_WRITING]: 'Escrita de Conteúdo',
  [TaskType.ILLUSTRATION]: 'Ilustração',
  [TaskType.VIDEO_PRODUCTION]: 'Produção de Vídeo',
  [TaskType.REVIEW]: 'Revisão',
  [TaskType.TRANSLATION]: 'Tradução',
  [TaskType.QUIZ_CREATION]: 'Criação de Quiz',
  [TaskType.FORUM_MODERATION]: 'Moderação de Fórum',
  [TaskType.TUTORING]: 'Tutoria',
  [TaskType.VALIDATION]: 'Validação',
  [TaskType.OTHER]: 'Outro',
};

export const TaskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: 'Pendente',
  [TaskStatus.IN_PROGRESS]: 'Em Andamento',
  [TaskStatus.UNDER_REVIEW]: 'Em Revisão',
  [TaskStatus.COMPLETED]: 'Concluído',
  [TaskStatus.CANCELLED]: 'Cancelado',
};

export const TaskPriorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Baixa',
  [TaskPriority.MEDIUM]: 'Média',
  [TaskPriority.HIGH]: 'Alta',
  [TaskPriority.URGENT]: 'Urgente',
};
