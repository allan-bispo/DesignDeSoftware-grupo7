import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'team_members' })
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, (team) => team.members)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => User, (user) => user.teamMemberships)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { nullable: true })
  role: string; // Papel específico dentro da equipe

  @Column('text', { nullable: true })
  responsibilities: string; // Responsabilidades específicas

  @Column({ type: 'datetime', nullable: true })
  joinedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  leftAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
