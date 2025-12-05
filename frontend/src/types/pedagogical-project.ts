import { User } from './user';

export enum PedagogicalApproach {
  SELF_INSTRUCTIONAL = 'autoinstrucional',
  TUTOR_SUPPORTED = 'com_apoio_tutor',
  ADVISOR_SUPPORTED = 'com_apoio_orientador',
}

export enum MicrocourseStatus {
  DRAFT = 'rascunho',
  IN_INTERNAL_VALIDATION = 'validacao_interna',
  IN_EXTERNAL_VALIDATION = 'validacao_externa',
  APPROVED = 'aprovado',
  PUBLISHED = 'publicado',
  ARCHIVED = 'arquivado',
}

export enum ValidationStage {
  INTERNAL_INF = 'interno_inf',
  INTERNAL_FF = 'interno_ff',
  INTERNAL_PRPG = 'interno_prpg',
  INTERNAL_CONSUNI = 'interno_consuni',
  EXTERNAL_DATASUS = 'externo_datasus',
}

export enum ValidationStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  APPROVED = 'aprovado',
  REJECTED = 'rejeitado',
  NEEDS_REVISION = 'necessita_revisao',
}

export interface LearningTrail {
  id: string;
  name: string;
  description: string;
  objectives?: string;
  order: number;
  isActive: boolean;
  coordinator?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ThematicArea {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  coordinator?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationWorkflow {
  id: string;
  stage: ValidationStage;
  status: ValidationStatus;
  validator?: User;
  comments?: string;
  attachments?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Microcourse {
  id: string;
  name: string;
  description: string;
  syllabus: string;
  expectedCompetencies?: string;
  graduateProfile?: string;
  bibliography?: string;
  workload: number;
  pedagogicalApproach: PedagogicalApproach;
  status: MicrocourseStatus;
  programContent?: string;
  evaluationMethods?: string;
  teachingStrategies?: string;
  learningTrail?: LearningTrail;
  thematicArea?: ThematicArea;
  prerequisites?: Microcourse[];
  coordinator?: User;
  assignedUsers?: User[];
  validationWorkflows?: ValidationWorkflow[];
  externalValidationData?: string;
  createdAt: string;
  updatedAt: string;
}

export const PedagogicalApproachLabels: Record<PedagogicalApproach, string> = {
  [PedagogicalApproach.SELF_INSTRUCTIONAL]: 'Autoinstrucional',
  [PedagogicalApproach.TUTOR_SUPPORTED]: 'Com Apoio de Tutor',
  [PedagogicalApproach.ADVISOR_SUPPORTED]: 'Com Apoio de Orientador',
};

export const MicrocourseStatusLabels: Record<MicrocourseStatus, string> = {
  [MicrocourseStatus.DRAFT]: 'Rascunho',
  [MicrocourseStatus.IN_INTERNAL_VALIDATION]: 'Em Validação Interna',
  [MicrocourseStatus.IN_EXTERNAL_VALIDATION]: 'Em Validação Externa',
  [MicrocourseStatus.APPROVED]: 'Aprovado',
  [MicrocourseStatus.PUBLISHED]: 'Publicado',
  [MicrocourseStatus.ARCHIVED]: 'Arquivado',
};

export const ValidationStageLabels: Record<ValidationStage, string> = {
  [ValidationStage.INTERNAL_INF]: 'INF (Interno)',
  [ValidationStage.INTERNAL_FF]: 'FF (Interno)',
  [ValidationStage.INTERNAL_PRPG]: 'PRPG (Interno)',
  [ValidationStage.INTERNAL_CONSUNI]: 'CONSUNI (Interno)',
  [ValidationStage.EXTERNAL_DATASUS]: 'DATASUS (Externo)',
};

export const ValidationStatusLabels: Record<ValidationStatus, string> = {
  [ValidationStatus.PENDING]: 'Pendente',
  [ValidationStatus.IN_PROGRESS]: 'Em Andamento',
  [ValidationStatus.APPROVED]: 'Aprovado',
  [ValidationStatus.REJECTED]: 'Rejeitado',
  [ValidationStatus.NEEDS_REVISION]: 'Necessita Revisão',
};
