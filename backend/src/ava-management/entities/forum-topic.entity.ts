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
import { CourseClass } from './course-class.entity';
import { User } from '../../users/entities/user.entity';
import { ForumPost } from './forum-post.entity';

@Entity({ name: 'forum_topics' })
export class ForumTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.forumTopics)
  @JoinColumn({ name: 'course_class_id' })
  courseClass: CourseClass;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(() => ForumPost, (post) => post.topic)
  posts: ForumPost[];

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
