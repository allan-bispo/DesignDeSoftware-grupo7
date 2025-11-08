import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Define a classe 'Curso' como uma tabela no banco de dados
@Entity({ name: 'cursos' }) // Define o nome da tabela (opcional, senão seria 'curso')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'BACKLOG' })
  status: string;

  @Column({ nullable: true }) // nullable: true significa que é opcional
  category: string;

  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  targetDate: Date;

  @CreateDateColumn() // Coluna gerenciada pelo TypeORM
  createdAt: Date;

  @UpdateDateColumn() // Coluna gerenciada pelo TypeORM
  updatedAt: Date;
}
