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
import { StudentEnrollment } from '../../student-interaction/entities/student-enrollment.entity';
import { ForumTopic } from './forum-topic.entity';

export enum ClassStatus {
  PLANNED = 'planejado',
  OPEN_FOR_ENROLLMENT = 'aberto_inscricoes',
  IN_PROGRESS = 'em_andamento',
  COMPLETED = 'concluido',
  CANCELLED = 'cancelado',
}

@Entity({ name: 'course_classes' })
export class CourseClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Microcourse)
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  @Column()
  name: string; // Ex: "Turma 2024.1"

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
    default: ClassStatus.PLANNED,
  })
  status: ClassStatus;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'integer', nullable: true })
  maxStudents: number; // Limite de alunos (null = ilimitado)

  // Tutor responsável
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor: User;

  // Orientador (se aplicável)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'advisor_id' })
  advisor: User;

  @Column('text', { nullable: true })
  moodleUrl: string; // URL do curso no Moodle

  @Column('text', { nullable: true })
  moodleId: string; // ID do curso no Moodle

  // Matrículas (alunos)
  @OneToMany(() => StudentEnrollment, (enrollment) => enrollment.courseClass)
  enrollments: StudentEnrollment[];

  // Fóruns
  @OneToMany(() => ForumTopic, (topic) => topic.courseClass)
  forumTopics: ForumTopic[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
