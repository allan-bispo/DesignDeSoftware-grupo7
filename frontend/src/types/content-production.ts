import { User } from './user';
import { Microcourse } from './pedagogical-project';

export enum TeachingPlanStatus {
  DRAFT = 'rascunho',
  UNDER_REVIEW = 'em_revisao',
  APPROVED = 'aprovado',
  REJECTED = 'rejeitado',
  PUBLISHED = 'publicado',
}

export enum EbookStatus {
  WRITING = 'escrita',
  ILLUSTRATION = 'ilustracao',
  EDITORIAL_REVIEW = 'revisao_editorial',
  LAYOUT_WEB = 'diagramacao_web',
  LAYOUT_PDF = 'diagramacao_pdf',
  APPROVED = 'aprovado',
  PUBLISHED = 'publicado',
}

export enum VideoStatus {
  SCRIPTING = 'roteirizacao',
  RECORDING = 'gravacao',
  EDITING = 'edicao',
  SUBTITLING = 'legendagem',
  REVIEW = 'revisao',
  APPROVED = 'aprovado',
  PUBLISHED = 'publicado',
}

export enum MaterialType {
  MIND_MAP = 'mapa_mental',
  INFOGRAPHIC = 'infografico',
  QUIZ = 'quiz',
  QUESTION_BANK = 'banco_questoes',
  SUMMARY_SHEET = 'folha_resumo',
  INTERACTIVE_ACTIVITY = 'atividade_interativa',
  OTHER = 'outro',
}

export enum MaterialStatus {
  PLANNING = 'planejamento',
  IN_PRODUCTION = 'em_producao',
  REVIEW = 'revisao',
  APPROVED = 'aprovado',
  PUBLISHED = 'publicado',
}

export enum ReviewType {
  CONTENT = 'conteudo',
  TECHNICAL = 'tecnica',
  PEDAGOGICAL = 'pedagogica',
  EDITORIAL = 'editorial',
  FINAL = 'final',
}

export enum ReviewStatus {
  PENDING = 'pendente',
  APPROVED = 'aprovado',
  APPROVED_WITH_CHANGES = 'aprovado_com_alteracoes',
  NEEDS_REVISION = 'necessita_revisao',
  REJECTED = 'rejeitado',
}

export enum IdentityType {
  LOGO = 'logo',
  STYLE_GUIDE = 'regua_estilo',
  BANNER = 'banner',
  PROMOTIONAL_ART = 'arte_divulgacao',
  CERTIFICATE_TEMPLATE = 'template_certificado',
  OTHER = 'outro',
}

export interface TeachingPlan {
  id: string;
  microcourse: Microcourse;
  title: string;
  objectives: string;
  content: string;
  teachingStrategies?: string;
  evaluationActivities?: string;
  resources?: string;
  status: TeachingPlanStatus;
  author?: User;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ebook {
  id: string;
  microcourse: Microcourse;
  title: string;
  description?: string;
  status: EbookStatus;
  author?: User;
  illustrator?: User;
  reviewer?: User;
  designer?: User;
  contentUrl?: string;
  webVersionUrl?: string;
  pdfVersionUrl?: string;
  version: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoLesson {
  id: string;
  microcourse: Microcourse;
  title: string;
  description?: string;
  status: VideoStatus;
  scriptwriter?: User;
  presenter?: User;
  editor?: User;
  scriptUrl?: string;
  rawVideoUrl?: string;
  editedVideoUrl?: string;
  youtubeUrl?: string;
  subtitlesUrl?: string;
  duration?: string;
  version: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DidacticMaterial {
  id: string;
  microcourse: Microcourse;
  title: string;
  description?: string;
  type: MaterialType;
  status: MaterialStatus;
  creator?: User;
  fileUrl?: string;
  tool?: string;
  externalUrl?: string;
  version: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisualIdentity {
  id: string;
  name: string;
  description?: string;
  type: IdentityType;
  microcourse?: Microcourse;
  designer?: User;
  fileUrl?: string;
  colorPalette?: string;
  fonts?: string;
  guidelines?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentReview {
  id: string;
  type: ReviewType;
  status: ReviewStatus;
  reviewer: User;
  comments?: string;
  suggestions?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const EbookStatusLabels: Record<EbookStatus, string> = {
  [EbookStatus.WRITING]: 'Escrita',
  [EbookStatus.ILLUSTRATION]: 'Ilustração',
  [EbookStatus.EDITORIAL_REVIEW]: 'Revisão Editorial',
  [EbookStatus.LAYOUT_WEB]: 'Diagramação Web',
  [EbookStatus.LAYOUT_PDF]: 'Diagramação PDF',
  [EbookStatus.APPROVED]: 'Aprovado',
  [EbookStatus.PUBLISHED]: 'Publicado',
};

export const VideoStatusLabels: Record<VideoStatus, string> = {
  [VideoStatus.SCRIPTING]: 'Roteirização',
  [VideoStatus.RECORDING]: 'Gravação',
  [VideoStatus.EDITING]: 'Edição',
  [VideoStatus.SUBTITLING]: 'Legendagem',
  [VideoStatus.REVIEW]: 'Revisão',
  [VideoStatus.APPROVED]: 'Aprovado',
  [VideoStatus.PUBLISHED]: 'Publicado',
};

export const MaterialTypeLabels: Record<MaterialType, string> = {
  [MaterialType.MIND_MAP]: 'Mapa Mental',
  [MaterialType.INFOGRAPHIC]: 'Infográfico',
  [MaterialType.QUIZ]: 'Quiz',
  [MaterialType.QUESTION_BANK]: 'Banco de Questões',
  [MaterialType.SUMMARY_SHEET]: 'Folha Resumo',
  [MaterialType.INTERACTIVE_ACTIVITY]: 'Atividade Interativa',
  [MaterialType.OTHER]: 'Outro',
};
