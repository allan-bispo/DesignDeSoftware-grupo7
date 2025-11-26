import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TeamMember } from '../../team-management/entities/team-member.entity';
import { TaskAssignment } from '../../team-management/entities/task-assignment.entity';

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

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Será hasheado

  @Column({
    type: 'text',
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  department: string; // Departamento/Setor

  @Column('text', { nullable: true })
  bio: string; // Biografia/Descrição profissional

  @Column('simple-array', { nullable: true })
  specializations: string[]; // Áreas de especialização

  @Column({ default: true })
  isActive: boolean;

  // Participações em equipes
  @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
  teamMemberships: TeamMember[];

  // Tarefas atribuídas
  @OneToMany(() => TaskAssignment, (assignment) => assignment.assignedTo)
  taskAssignments: TaskAssignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
