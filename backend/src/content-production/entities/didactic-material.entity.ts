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

@Entity({ name: 'didactic_materials' })
export class DidacticMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Microcourse)
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
  })
  type: MaterialType;

  @Column({
    type: 'text',
    default: MaterialStatus.PLANNING,
  })
  status: MaterialStatus;

  // Criador do material
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column('text', { nullable: true })
  fileUrl: string; // URL do arquivo (Google Drive, etc)

  @Column('text', { nullable: true })
  tool: string; // Ferramenta utilizada (GoConqr, Canva, H5P, etc)

  @Column('text', { nullable: true })
  externalUrl: string; // URL externa se hospedado em plataforma específica

  @OneToMany(() => ContentReview, (review) => review.didacticMaterial)
  reviews: ContentReview[];

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
