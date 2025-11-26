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
import { Microcourse } from './microcourse.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'learning_trails' })
export class LearningTrail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  objectives: string; // Objetivos da trilha

  @Column({ type: 'integer', default: 0 })
  order: number; // Ordem de exibição

  @Column({ default: true })
  isActive: boolean;

  // Microcursos que fazem parte desta trilha
  @OneToMany(() => Microcourse, (microcourse) => microcourse.learningTrail)
  microcourses: Microcourse[];

  // Coordenador da trilha
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
