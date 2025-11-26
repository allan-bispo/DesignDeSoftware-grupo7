import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Microcourse } from '../../pedagogical-project/entities/microcourse.entity';

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

@Entity({ name: 'task_assignments' })
export class TaskAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
  })
  type: TaskType;

  @Column({
    type: 'text',
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'text',
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  // Usuário responsável
  @ManyToOne(() => User, (user) => user.taskAssignments)
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  // Usuário que criou a tarefa
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  // Microcurso relacionado (se aplicável)
  @ManyToOne(() => Microcourse, { nullable: true })
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @Column('text', { nullable: true })
  notes: string;

  @Column('text', { nullable: true })
  attachments: string; // JSON com links para arquivos

  @Column({ type: 'integer', default: 0 })
  progress: number; // 0-100

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
