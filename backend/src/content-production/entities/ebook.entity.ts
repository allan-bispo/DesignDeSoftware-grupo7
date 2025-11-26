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

export enum EbookStatus {
  WRITING = 'escrita',
  ILLUSTRATION = 'ilustracao',
  EDITORIAL_REVIEW = 'revisao_editorial',
  LAYOUT_WEB = 'diagramacao_web',
  LAYOUT_PDF = 'diagramacao_pdf',
  APPROVED = 'aprovado',
  PUBLISHED = 'publicado',
}

@Entity({ name: 'ebooks' })
export class Ebook {
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
    default: EbookStatus.WRITING,
  })
  status: EbookStatus;

  // Autor/Conteudista
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  // Ilustrador
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'illustrator_id' })
  illustrator: User;

  // Revisor
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  // Designer/Diagramador
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'designer_id' })
  designer: User;

  @Column('text', { nullable: true })
  contentUrl: string; // URL do Google Drive ou similar

  @Column('text', { nullable: true })
  webVersionUrl: string; // URL da versão web

  @Column('text', { nullable: true })
  pdfVersionUrl: string; // URL da versão PDF

  @OneToMany(() => ContentReview, (review) => review.ebook)
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
