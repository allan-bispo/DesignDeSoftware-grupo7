import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentEnrollment } from './student-enrollment.entity';
import { User } from '../../users/entities/user.entity';

export enum InterventionType {
  EMAIL = 'email',
  PHONE_CALL = 'ligacao',
  MESSAGE = 'mensagem',
  MEETING = 'reuniao',
  OTHER = 'outro',
}

export enum InterventionReason {
  LOW_ACCESS = 'baixo_acesso',
  LOW_PERFORMANCE = 'baixo_desempenho',
  INACTIVITY = 'inatividade',
  MISSING_ACTIVITIES = 'atividades_pendentes',
  AT_RISK = 'risco_evasao',
  OTHER = 'outro',
}

export enum InterventionStatus {
  PLANNED = 'planejada',
  EXECUTED = 'executada',
  CANCELLED = 'cancelada',
}

@Entity({ name: 'intervention_actions' })
export class InterventionAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudentEnrollment, (enrollment) => enrollment.interventions)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: StudentEnrollment;

  @Column({
    type: 'text',
  })
  type: InterventionType;

  @Column({
    type: 'text',
  })
  reason: InterventionReason;

  @Column({
    type: 'text',
    default: InterventionStatus.PLANNED,
  })
  status: InterventionStatus;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'responsible_id' })
  responsible: User; // Responsável pela intervenção (tutor, coordenador, etc)

  @Column({ type: 'datetime', nullable: true })
  plannedDate: Date;

  @Column({ type: 'datetime', nullable: true })
  executedDate: Date;

  @Column('text', { nullable: true })
  notes: string; // Anotações sobre a intervenção

  @Column({ default: false })
  wasSuccessful: boolean; // Se a intervenção foi bem-sucedida

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
