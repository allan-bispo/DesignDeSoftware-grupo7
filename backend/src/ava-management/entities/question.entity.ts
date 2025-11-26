import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionBank } from './question-bank.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multipla_escolha',
  TRUE_FALSE = 'verdadeiro_falso',
  SHORT_ANSWER = 'resposta_curta',
  ESSAY = 'dissertativa',
  MATCHING = 'associacao',
}

export enum QuestionDifficulty {
  EASY = 'facil',
  MEDIUM = 'medio',
  HARD = 'dificil',
}

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QuestionBank, (bank) => bank.questions)
  @JoinColumn({ name: 'question_bank_id' })
  questionBank: QuestionBank;

  @Column('text')
  questionText: string;

  @Column({
    type: 'text',
  })
  type: QuestionType;

  @Column({
    type: 'text',
    default: QuestionDifficulty.MEDIUM,
  })
  difficulty: QuestionDifficulty;

  @Column('text', { nullable: true })
  options: string; // JSON com opções de resposta (para múltipla escolha)

  @Column('text', { nullable: true })
  correctAnswer: string; // Resposta correta

  @Column('text', { nullable: true })
  explanation: string; // Explicação da resposta

  @Column('simple-array', { nullable: true })
  tags: string[]; // Tags para categorização

  @Column({ type: 'integer', default: 0 })
  timesUsed: number; // Quantas vezes foi usada

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
