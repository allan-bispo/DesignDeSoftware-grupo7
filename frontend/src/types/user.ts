export enum UserRole {
  // Coordenadores
  GENERAL_COORDINATOR = 'coordenador_geral',
  PEDAGOGICAL_COORDINATOR = 'coordenador_pedagogico',
  THEMATIC_AREA_COORDINATOR = 'coordenador_area_tematica',
  // Docentes
  CONTENT_CREATOR = 'professor_conteudista',
  ADVISOR = 'professor_orientador',
  // Tutoria
  TUTOR = 'tutor',
  // Equipe de Produção
  INSTRUCTIONAL_DESIGNER = 'designer_instrucional',
  GRAPHIC_DESIGNER = 'designer_grafico',
  VIDEO_EDITOR = 'editor_video',
  DEVELOPER = 'desenvolvedor',
  ILLUSTRATOR = 'ilustrador',
  REVIEWER = 'revisor',
  // Administrativo
  ADMIN = 'admin',
  // Estudantes
  STUDENT = 'estudante',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  bio?: string;
  specializations?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.GENERAL_COORDINATOR]: 'Coordenador Geral',
  [UserRole.PEDAGOGICAL_COORDINATOR]: 'Coordenador Pedagógico',
  [UserRole.THEMATIC_AREA_COORDINATOR]: 'Coordenador de Área Temática',
  [UserRole.CONTENT_CREATOR]: 'Professor Conteudista',
  [UserRole.ADVISOR]: 'Professor Orientador',
  [UserRole.TUTOR]: 'Tutor',
  [UserRole.INSTRUCTIONAL_DESIGNER]: 'Designer Instrucional',
  [UserRole.GRAPHIC_DESIGNER]: 'Designer Gráfico',
  [UserRole.VIDEO_EDITOR]: 'Editor de Vídeo',
  [UserRole.DEVELOPER]: 'Desenvolvedor',
  [UserRole.ILLUSTRATOR]: 'Ilustrador',
  [UserRole.REVIEWER]: 'Revisor',
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.STUDENT]: 'Estudante',
};
