import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { LearningTrail } from './learning-trail.entity';
import { ThematicArea } from './thematic-area.entity';
import { ValidationWorkflow } from './validation-workflow.entity';
import { User } from '../../users/entities/user.entity';

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

@Entity({ name: 'microcourses' })
export class Microcourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  syllabus: string; // Ementa

  @Column('text', { nullable: true })
  expectedCompetencies: string; // Competências esperadas

  @Column('text', { nullable: true })
  graduateProfile: string; // Perfil do egresso

  @Column('text', { nullable: true })
  bibliography: string; // Referências bibliográficas

  @Column({ type: 'integer' })
  workload: number; // Carga horária em horas

  @Column({
    type: 'text',
  })
  pedagogicalApproach: PedagogicalApproach;

  @Column({
    type: 'text',
    default: MicrocourseStatus.DRAFT,
  })
  status: MicrocourseStatus;

  @Column('text', { nullable: true })
  programContent: string; // Conteúdo programático

  @Column('text', { nullable: true })
  evaluationMethods: string; // Métodos de avaliação

  @Column('text', { nullable: true })
  teachingStrategies: string; // Estratégias de ensino

  // Relação com trilhas de aprendizagem
  @ManyToOne(() => LearningTrail, (trail) => trail.microcourses, {
    nullable: true,
  })
  @JoinColumn({ name: 'learning_trail_id' })
  learningTrail: LearningTrail;

  // Relação com área temática
  @ManyToOne(() => ThematicArea, (area) => area.microcourses, {
    nullable: true,
  })
  @JoinColumn({ name: 'thematic_area_id' })
  thematicArea: ThematicArea;

  // Pré-requisitos (outros microcursos)
  @ManyToMany(() => Microcourse)
  @JoinTable({
    name: 'microcourse_prerequisites',
    joinColumn: { name: 'microcourse_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'prerequisite_id', referencedColumnName: 'id' },
  })
  prerequisites: Microcourse[];

  // Coordenador responsável
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: User;

  // Fluxo de validação
  @OneToMany(() => ValidationWorkflow, (workflow) => workflow.microcourse)
  validationWorkflows: ValidationWorkflow[];

  @Column('text', { nullable: true })
  externalValidationData: string; // Dados de validação DATASUS/UFG (JSON)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
