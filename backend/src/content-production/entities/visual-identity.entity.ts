import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Microcourse } from '../../pedagogical-project/entities/microcourse.entity';
import { User } from '../../users/entities/user.entity';

export enum IdentityType {
  LOGO = 'logo',
  STYLE_GUIDE = 'regua_estilo',
  BANNER = 'banner',
  PROMOTIONAL_ART = 'arte_divulgacao',
  CERTIFICATE_TEMPLATE = 'template_certificado',
  OTHER = 'outro',
}

@Entity({ name: 'visual_identities' })
export class VisualIdentity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
  })
  type: IdentityType;

  // Pode ser associado a um microcurso específico ou ser geral do projeto
  @ManyToOne(() => Microcourse, { nullable: true })
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  // Designer responsável
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'designer_id' })
  designer: User;

  @Column('text', { nullable: true })
  fileUrl: string; // URL do arquivo

  @Column('text', { nullable: true })
  colorPalette: string; // Paleta de cores (JSON)

  @Column('text', { nullable: true })
  fonts: string; // Fontes utilizadas

  @Column('text', { nullable: true })
  guidelines: string; // Diretrizes de uso

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
