import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { UsefulLink } from './useful-link.entity';
import { Comment } from './comment.entity';
import { ActionHistory } from './action-history.entity';

export enum TrainingType {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  FULLSTACK = 'Fullstack',
  DEVOPS = 'DevOps',
  MOBILE = 'Mobile',
  DATA_SCIENCE = 'Data Science',
}

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  responsible: string;

  @Column({
    type: 'text',
  })
  trainingType: TrainingType;

  @Column({ type: 'integer', default: 0 })
  completion: number; // 0-100

  @Column({ type: 'datetime' })
  deliveryDate: Date;

  @Column()
  duration: string;

  @Column({ type: 'integer' })
  modules: number;

  @Column('text')
  projectNotes: string;

  @OneToMany(() => ChecklistItem, (item) => item.course, {
    cascade: true,
    eager: true,
  })
  checklist: ChecklistItem[];

  @OneToMany(() => UsefulLink, (link) => link.course, {
    cascade: true,
    eager: true,
  })
  usefulLinks?: UsefulLink[];

  @OneToMany(() => Comment, (comment) => comment.course, {
    cascade: true,
    eager: true,
  })
  comments?: Comment[];

  @OneToMany(() => ActionHistory, (history) => history.course, {
    cascade: true,
    eager: true,
  })
  actionHistory?: ActionHistory[];

  @CreateDateColumn()
  createdAt: Date;
}
