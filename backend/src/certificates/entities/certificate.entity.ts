import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentEnrollment } from '../../student-interaction/entities/student-enrollment.entity';
import { User } from '../../users/entities/user.entity';
import { Microcourse } from '../../pedagogical-project/entities/microcourse.entity';

export enum CertificateStatus {
  PENDING = 'pendente',
  GENERATED = 'gerado',
  VALIDATED_SEI = 'validado_sei',
  ISSUED = 'emitido',
  CANCELLED = 'cancelado',
}

@Entity({ name: 'certificates' })
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Matrícula do aluno
  @ManyToOne(() => StudentEnrollment)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: StudentEnrollment;

  // Aluno
  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  // Microcurso
  @ManyToOne(() => Microcourse)
  @JoinColumn({ name: 'microcourse_id' })
  microcourse: Microcourse;

  @Column({
    type: 'text',
    default: CertificateStatus.PENDING,
  })
  status: CertificateStatus;

  @Column({ unique: true })
  certificateNumber: string; // Número único do certificado

  @Column({ type: 'datetime' })
  issueDate: Date; // Data de emissão

  @Column({ type: 'datetime', nullable: true })
  completionDate: Date; // Data de conclusão do curso

  @Column({ type: 'integer' })
  workload: number; // Carga horária

  @Column('text', { nullable: true })
  pdfUrl: string; // URL do PDF do certificado

  @Column('text', { nullable: true })
  seiProcessNumber: string; // Número do processo no SEI

  @Column('text', { nullable: true })
  seiDocumentId: string; // ID do documento no SEI

  @Column({ type: 'datetime', nullable: true })
  seiValidatedAt: Date; // Data de validação no SEI

  @Column('text', { nullable: true })
  validationCode: string; // Código de validação para verificação externa

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
