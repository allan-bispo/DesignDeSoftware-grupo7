import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Microcourse } from '../../pedagogical-project/entities/microcourse.entity';
import { User } from '../../users/entities/user.entity';
import { Question } from './question.entity';

@Entity({ name: 'question_banks' })
export class QuestionBank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Microcourse, { nullable: true })
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(() => Question, (question) => question.questionBank)
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
