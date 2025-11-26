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

export enum VideoStatus {
  SCRIPTING = 'roteirizacao',
  RECORDING = 'gravacao',
  EDITING = 'edicao',
  SUBTITLING = 'legendagem',
  REVIEW = 'revisao',
  APPROVED = 'aprovado',
  PUBLISHED = 'publicado',
}

@Entity({ name: 'video_lessons' })
export class VideoLesson {
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
    default: VideoStatus.SCRIPTING,
  })
  status: VideoStatus;

  // Roteirista
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'scriptwriter_id' })
  scriptwriter: User;

  // Professor/Apresentador
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'presenter_id' })
  presenter: User;

  // Editor de vídeo
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'editor_id' })
  editor: User;

  @Column('text', { nullable: true })
  scriptUrl: string; // URL do roteiro

  @Column('text', { nullable: true })
  rawVideoUrl: string; // URL do vídeo bruto (Google Drive)

  @Column('text', { nullable: true })
  editedVideoUrl: string; // URL do vídeo editado

  @Column('text', { nullable: true })
  youtubeUrl: string; // URL no YouTube

  @Column('text', { nullable: true })
  subtitlesUrl: string; // URL do arquivo de legendas

  @Column({ nullable: true })
  duration: string; // Duração do vídeo (HH:MM:SS)

  @OneToMany(() => ContentReview, (review) => review.videoLesson)
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
