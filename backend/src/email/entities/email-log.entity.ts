import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';

export enum EmailType {
  EXPIRATION_WARNING_7_DAYS = 'expiration_warning_7_days',
  EXPIRATION_WARNING_1_DAY = 'expiration_warning_1_day',
  EXPIRATION_ALERT = 'expiration_alert',
  TEST_EMAIL = 'test_email',
  GENERAL = 'general',
}

export enum EmailStatus {
  SENT = 'sent',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: EmailType,
  })
  type: EmailType;

  @Column({
    type: 'varchar',
    length: 20,
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @Column({ type: 'varchar', length: 255 })
  recipientEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipientName: string;

  @Column({ type: 'varchar', length: 500 })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  messageId: string; // AWS SES Message ID

  @ManyToOne(() => Course, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recipient_user_id' })
  recipientUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date;
}
