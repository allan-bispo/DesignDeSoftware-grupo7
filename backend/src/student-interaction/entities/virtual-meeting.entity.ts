import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseClass } from '../../ava-management/entities/course-class.entity';
import { User } from '../../users/entities/user.entity';

export enum MeetingType {
  LIVE_CLASS = 'aula_ao_vivo',
  OFFICE_HOURS = 'plantao_duvidas',
  ORIENTATION = 'orientacao',
  WEBINAR = 'webinar',
  OTHER = 'outro',
}

export enum MeetingStatus {
  SCHEDULED = 'agendado',
  IN_PROGRESS = 'em_andamento',
  COMPLETED = 'concluido',
  CANCELLED = 'cancelado',
}

@Entity({ name: 'virtual_meetings' })
export class VirtualMeeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourseClass, { nullable: true })
  @JoinColumn({ name: 'course_class_id' })
  courseClass: CourseClass;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
  })
  type: MeetingType;

  @Column({
    type: 'text',
    default: MeetingStatus.SCHEDULED,
  })
  status: MeetingStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'host_id' })
  host: User; // Anfitrião (professor, tutor, etc)

  @Column({ type: 'datetime' })
  scheduledDate: Date;

  @Column({ nullable: true })
  duration: string; // Duração estimada (HH:MM)

  @Column('text', { nullable: true })
  meetingUrl: string; // URL da reunião (Google Meet, Zoom, etc)

  @Column('text', { nullable: true })
  recordingUrl: string; // URL da gravação

  @Column({ type: 'integer', default: 0 })
  attendees: number; // Número de participantes

  @Column('text', { nullable: true })
  googleCalendarEventId: string; // ID do evento no Google Calendar

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
