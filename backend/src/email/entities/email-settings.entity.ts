import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_settings')
export class EmailSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  awsAccessKeyId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  awsSecretAccessKey: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  awsRegion: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  senderEmail: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  senderName: string | null;

  @Column({ type: 'boolean', default: false })
  isEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  isConfigured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
