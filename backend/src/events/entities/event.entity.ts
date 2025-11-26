import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Microcourse } from '../../pedagogical-project/entities/microcourse.entity';
import { User } from '../../users/entities/user.entity';
import { EventTeamMember } from './event-team-member.entity';

export enum EventType {
  OPENING = 'abertura',
  CLOSING = 'encerramento',
  WORKSHOP = 'workshop',
  SEMINAR = 'seminario',
  CONFERENCE = 'conferencia',
  OTHER = 'outro',
}

export enum EventStatus {
  PLANNING = 'planejamento',
  SCHEDULED = 'agendado',
  IN_PROGRESS = 'em_andamento',
  COMPLETED = 'concluido',
  CANCELLED = 'cancelado',
}

export enum EventMode {
  ONLINE = 'online',
  IN_PERSON = 'presencial',
  HYBRID = 'hibrido',
}

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
  })
  type: EventType;

  @Column({
    type: 'text',
    default: EventStatus.PLANNING,
  })
  status: EventStatus;

  @Column({
    type: 'text',
  })
  mode: EventMode;

  // Microcurso relacionado (se aplicável)
  @ManyToOne(() => Microcourse, { nullable: true })
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  // Coordenador do evento
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: User;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column('text', { nullable: true })
  targetAudience: string; // Público-alvo

  @Column({ type: 'integer', nullable: true })
  expectedAttendees: number; // Número esperado de participantes

  @Column({ type: 'integer', default: 0 })
  actualAttendees: number; // Número real de participantes

  @Column('text', { nullable: true })
  location: string; // Local (se presencial) ou URL (se online)

  @Column('text', { nullable: true })
  infrastructure: string; // Infraestrutura necessária

  @Column('text', { nullable: true })
  agenda: string; // Programação do evento

  // Equipe do evento
  @OneToMany(() => EventTeamMember, (member) => member.event)
  team: EventTeamMember[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedBudget: number; // Orçamento estimado

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost: number; // Custo real

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
