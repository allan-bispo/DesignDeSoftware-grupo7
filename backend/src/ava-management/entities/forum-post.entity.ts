import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ForumTopic } from './forum-topic.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'forum_posts' })
export class ForumPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ForumTopic, (topic) => topic.posts)
  @JoinColumn({ name: 'topic_id' })
  topic: ForumTopic;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column('text')
  content: string;

  // Resposta a outro post (para threading)
  @ManyToOne(() => ForumPost, { nullable: true })
  @JoinColumn({ name: 'parent_post_id' })
  parentPost: ForumPost;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
