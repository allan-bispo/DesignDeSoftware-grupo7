import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Microcourse } from '../../pedagogical-project/entities/microcourse.entity';
import { User } from '../../users/entities/user.entity';
import { ContentReview } from './content-review.entity';

export enum TeachingPlanStatus {
  DRAFT = 'rascunho',
  UNDER_REVIEW = 'em_revisao',
  APPROVED = 'aprovado',
  REJECTED = 'rejeitado',
  PUBLISHED = 'publicado',
}

@Entity({ name: 'teaching_plans' })
export class TeachingPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Microcourse)
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  @Column()
  title: string;

  @Column('text')
  objectives: string; // Objetivos de aprendizagem

  @Column('text')
  content: string; // Conteúdo programático detalhado

  @Column('text', { nullable: true })
  teachingStrategies: string; // Estratégias educacionais

  @Column('text', { nullable: true })
  evaluationActivities: string; // Atividades avaliativas

  @Column('text', { nullable: true })
  resources: string; // Recursos necessários

  @Column({
    type: 'text',
    default: TeachingPlanStatus.DRAFT,
  })
  status: TeachingPlanStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => ContentReview, (review) => review.teachingPlan)
  reviews: ContentReview[];

  @Column({ type: 'integer', default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
