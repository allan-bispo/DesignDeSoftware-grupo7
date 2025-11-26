import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'event_team_members' })
export class EventTeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.team)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { nullable: true })
  role: string; // Papel no evento (palestrante, moderador, apoio técnico, etc)

  @Column('text', { nullable: true })
  responsibilities: string;

  @CreateDateColumn()
  createdAt: Date;
}
