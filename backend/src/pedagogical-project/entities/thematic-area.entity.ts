import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Microcourse } from './microcourse.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'thematic_areas' })
export class ThematicArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ default: true })
  isActive: boolean;

  // Microcursos desta área temática
  @OneToMany(() => Microcourse, (microcourse) => microcourse.thematicArea)
  microcourses: Microcourse[];

  // Coordenador da área temática
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
