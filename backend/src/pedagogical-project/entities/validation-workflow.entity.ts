import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Microcourse } from './microcourse.entity';
import { User } from '../../users/entities/user.entity';

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

@Entity({ name: 'validation_workflows' })
export class ValidationWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Microcourse, (microcourse) => microcourse.validationWorkflows)
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  @Column({
    type: 'text',
  })
  stage: ValidationStage;

  @Column({
    type: 'text',
    default: ValidationStatus.PENDING,
  })
  status: ValidationStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'validator_id' })
  validator: User; // Responsável pela validação

  @Column('text', { nullable: true })
  comments: string;

  @Column('text', { nullable: true })
  attachments: string; // JSON com links para documentos

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
