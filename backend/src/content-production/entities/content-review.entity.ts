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
import { TeachingPlan } from './teaching-plan.entity';
import { Ebook } from './ebook.entity';
import { VideoLesson } from './video-lesson.entity';
import { DidacticMaterial } from './didactic-material.entity';

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

@Entity({ name: 'content_reviews' })
export class ContentReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  type: ReviewType;

  @Column({
    type: 'text',
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column('text', { nullable: true })
  comments: string;

  @Column('text', { nullable: true })
  suggestions: string;

  // Relacionamentos com diferentes tipos de conteúdo (apenas um será preenchido)
  @ManyToOne(() => TeachingPlan, (plan) => plan.reviews, { nullable: true })
  @JoinColumn({ name: 'teaching_plan_id' })
  teachingPlan: TeachingPlan;

  @ManyToOne(() => Ebook, (ebook) => ebook.reviews, { nullable: true })
  @JoinColumn({ name: 'ebook_id' })
  ebook: Ebook;

  @ManyToOne(() => VideoLesson, (video) => video.reviews, { nullable: true })
  @JoinColumn({ name: 'video_lesson_id' })
  videoLesson: VideoLesson;

  @ManyToOne(() => DidacticMaterial, (material) => material.reviews, {
    nullable: true,
  })
  @JoinColumn({ name: 'didactic_material_id' })
  didacticMaterial: DidacticMaterial;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
