import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeamMember } from './team-member.entity';
import { User } from '../../users/entities/user.entity';
import { Microcourse } from '../../pedagogical-project/entities/microcourse.entity';

export enum TeamType {
  PRODUCTION = 'producao',
  PEDAGOGICAL = 'pedagogico',
  TUTORING = 'tutoria',
  COORDINATION = 'coordenacao',
  SUPPORT = 'suporte',
}

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
  })
  type: TeamType;

  // Coordenador/Líder da equipe
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'leader_id' })
  leader: User;

  // Microcurso associado (se aplicável)
  @ManyToOne(() => Microcourse, { nullable: true })
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  // Membros da equipe
  @OneToMany(() => TeamMember, (member) => member.team)
  members: TeamMember[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
