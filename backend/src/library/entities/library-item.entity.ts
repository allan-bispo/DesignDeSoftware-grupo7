import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum LibraryCategory {
  DOCUMENTATION = 'Documentation',
  TOOL = 'Tool',
  TEMPLATE = 'Template',
  RESOURCE = 'Resource',
  GUIDE = 'Guide',
  ARTICLE = 'Article',
}

@Entity({ name: 'library_items' })
export class LibraryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({
    type: 'text',
  })
  category: LibraryCategory;

  @Column('simple-array', { default: '' })
  tags: string[];

  @Column('text', { nullable: true })
  description?: string;

  @CreateDateColumn()
  addedAt: Date;

  @Column()
  addedBy: string;
}

