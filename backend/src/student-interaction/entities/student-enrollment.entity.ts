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
import { CourseClass } from '../../ava-management/entities/course-class.entity';
import { User } from '../../users/entities/user.entity';
import { StudentProgress } from './student-progress.entity';
import { InterventionAction } from './intervention-action.entity';

export enum EnrollmentStatus {
  ACTIVE = 'ativo',
  COMPLETED = 'concluido',
  DROPPED = 'desistente',
  FAILED = 'reprovado',
  IN_PROGRESS = 'em_andamento',
}

@Entity({ name: 'student_enrollments' })
export class StudentEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.enrollments)
  @JoinColumn({ name: 'course_class_id' })
  courseClass: CourseClass;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({
    type: 'text',
    default: EnrollmentStatus.IN_PROGRESS,
  })
  status: EnrollmentStatus;

  @Column({ type: 'datetime' })
  enrollmentDate: Date;

  @Column({ type: 'datetime', nullable: true })
  completionDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  finalGrade: number; // Nota final (0-100)

  @Column('text', { nullable: true })
  sigaaId: string; // ID da matrícula no SIGAA

  // Progresso do aluno
  @OneToMany(() => StudentProgress, (progress) => progress.enrollment)
  progress: StudentProgress[];

  // Ações de intervenção
  @OneToMany(() => InterventionAction, (action) => action.enrollment)
  interventions: InterventionAction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
