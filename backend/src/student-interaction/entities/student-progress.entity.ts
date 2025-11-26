import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentEnrollment } from './student-enrollment.entity';

@Entity({ name: 'student_progress' })
export class StudentProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudentEnrollment, (enrollment) => enrollment.progress)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: StudentEnrollment;

  @Column()
  activityName: string; // Nome da atividade/módulo

  @Column('text', { nullable: true })
  activityType: string; // Tipo: quiz, video, leitura, etc

  @Column({ type: 'datetime', nullable: true })
  accessedAt: Date; // Último acesso

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grade: number; // Nota obtida (se aplicável)

  @Column({ type: 'integer', default: 0 })
  attempts: number; // Número de tentativas

  @Column('text', { nullable: true })
  moodleActivityId: string; // ID da atividade no Moodle

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
