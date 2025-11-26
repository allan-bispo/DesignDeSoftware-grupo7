import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  syllabus: string; // Ementa

  @Column({ type: 'integer' })
  workload: number; // Carga horária em horas

  @Column({ type: 'datetime' })
  expirationDate: Date; // Data de expiração

  @Column({ type: 'integer', default: 0 })
  completion: number; // 0-100 (calculado baseado nos checkboxes)

  @OneToMany(() => ChecklistItem, (item) => item.course, {
    cascade: true,
    eager: true,
  })
  checklist: ChecklistItem[];

  @CreateDateColumn()
  createdAt: Date;
}
