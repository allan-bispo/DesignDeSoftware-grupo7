import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ActionHistory } from './action-history.entity';
import { Comment } from './comment.entity';
import { UsefulLink } from './useful-link.entity';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'text', nullable: true })
  syllabus?: string; // Ementa

  @Column({ type: 'integer', nullable: true })
  workload?: number; // Carga horária em horas

  @Column({ type: 'datetime', nullable: true })
  expirationDate?: Date; // Data de expiração

  @Column({ type: 'integer', default: 0 })
  completion: number; // 0-100 (calculado baseado nos checkboxes)

  @OneToMany(() => ChecklistItem, (item) => item.course, {
    cascade: true,
    eager: true,
  })
  checklist: ChecklistItem[];

  @OneToMany(() => ActionHistory, (history) => history.course, {
    cascade: true,
  })
  actionHistory: ActionHistory[];

  @OneToMany(() => Comment, (comment) => comment.course, {
    cascade: true,
  })
  comments: Comment[];

  @OneToMany(() => UsefulLink, (link) => link.course, {
    cascade: true,
  })
  usefulLinks: UsefulLink[];

  @CreateDateColumn()
  createdAt: Date;
}
