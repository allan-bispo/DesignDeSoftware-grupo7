import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailLog, EmailType, EmailStatus } from './entities/email-log.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { EmailService } from './email.service';
import { EmailLogFiltersDto } from './dto/email-log-filters.dto';

@Injectable()
export class EmailNotificationsService {
  private readonly logger = new Logger(EmailNotificationsService.name);

  constructor(
    @InjectRepository(EmailLog)
    private readonly emailLogRepository: Repository<EmailLog>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly emailService: EmailService,
  ) {}

  // Executa todos os dias às 9:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkCourseExpirations() {
    this.logger.log('Iniciando verificação de expirações de cursos...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Data daqui a 7 dias
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      sevenDaysFromNow.setHours(23, 59, 59, 999);

      // Data daqui a 1 dia
      const oneDayFromNow = new Date(today);
      oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
      oneDayFromNow.setHours(23, 59, 59, 999);

      // Busca cursos que expiram em 7 dias (ainda não completados)
      const coursesExpiring7Days = await this.courseRepository.find({
        where: {
          expirationDate: Between(sevenDaysFromNow, sevenDaysFromNow),
        },
        relations: ['responsible', 'assignedUsers'],
      });

      // Busca cursos que expiram em 1 dia (ainda não completados)
      const coursesExpiring1Day = await this.courseRepository.find({
        where: {
          expirationDate: Between(oneDayFromNow, oneDayFromNow),
        },
        relations: ['responsible', 'assignedUsers'],
      });

      // Processa avisos de 7 dias
      for (const course of coursesExpiring7Days) {
        if (course.completion < 100) {
          await this.sendExpirationWarning(course, 7);
        }
      }

      // Processa avisos de 1 dia
      for (const course of coursesExpiring1Day) {
        if (course.completion < 100) {
          await this.sendExpirationWarning(course, 1);
        }
      }

      this.logger.log(
        `Verificação concluída. Avisos de 7 dias: ${coursesExpiring7Days.length}, Avisos de 1 dia: ${coursesExpiring1Day.length}`,
      );
    } catch (error) {
      this.logger.error(`Erro ao verificar expirações: ${error.message}`, error.stack);
    }
  }

  private async sendExpirationWarning(course: Course, daysUntilExpiration: number) {
    const emailType =
      daysUntilExpiration === 7
        ? EmailType.EXPIRATION_WARNING_7_DAYS
        : EmailType.EXPIRATION_WARNING_1_DAY;

    const subject = `⚠️ Aviso: Curso "${course.name}" expira em ${daysUntilExpiration} dia(s)`;

    if (!course.expirationDate) {
      this.logger.warn(`Course ${course.id} does not have an expiration date`);
      return;
    }

    const expirationDate = new Date(course.expirationDate).toLocaleDateString('pt-BR');

    // Cria lista de destinatários
    const recipients: Array<{ email: string; name: string; user: User }> = [];

    // Adiciona o responsável
    if (course.responsible?.email) {
      recipients.push({
        email: course.responsible.email,
        name: course.responsible.name,
        user: course.responsible,
      });
    }

    // Adiciona os usuários atribuídos
    if (course.assignedUsers && course.assignedUsers.length > 0) {
      course.assignedUsers.forEach((user) => {
        if (user.email && !recipients.find((r) => r.email === user.email)) {
          recipients.push({
            email: user.email,
            name: user.name,
            user: user,
          });
        }
      });
    }

    // Envia email para cada destinatário
    for (const recipient of recipients) {
      const body = this.generateExpirationEmailBody(
        recipient.name,
        course.name,
        expirationDate,
        daysUntilExpiration,
        course.completion,
      );

      // Cria registro de log
      const emailLog = this.emailLogRepository.create({
        type: emailType,
        status: EmailStatus.PENDING,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        subject,
        body,
        course,
        recipientUser: recipient.user,
      });

      try {
        // Envia o email
        const result = await this.emailService.sendEmail(
          recipient.email,
          subject,
          body,
          this.generateExpirationEmailHTML(
            recipient.name,
            course.name,
            expirationDate,
            daysUntilExpiration,
            course.completion,
          ),
        );

        // Atualiza o log com sucesso
        emailLog.status = EmailStatus.SENT;
        emailLog.messageId = result.messageId;
        emailLog.sentAt = new Date();

        this.logger.log(
          `Email de aviso (${daysUntilExpiration} dias) enviado para ${recipient.email} sobre o curso "${course.name}"`,
        );
      } catch (error) {
        // Registra erro
        emailLog.status = EmailStatus.FAILED;
        emailLog.errorMessage = error.message;

        this.logger.error(
          `Erro ao enviar email para ${recipient.email}: ${error.message}`,
        );
      }

      // Salva o log
      await this.emailLogRepository.save(emailLog);
    }
  }

  private generateExpirationEmailBody(
    recipientName: string,
    courseName: string,
    expirationDate: string,
    daysRemaining: number,
    completion: number,
  ): string {
    return `
Olá ${recipientName},

Este é um aviso automático sobre o curso "${courseName}".

⚠️ O curso expira em ${daysRemaining} dia(s) - Data de expiração: ${expirationDate}

Status atual:
- Progresso: ${completion}%
- ${completion < 100 ? `Faltam ${100 - completion}% para conclusão` : 'Curso concluído'}

${
  completion < 100
    ? 'Por favor, certifique-se de concluir o curso antes da data de expiração.'
    : ''
}

Este é um email automático do sistema AKCIT.
Não responda a este email.

---
Sistema de Gestão AKCIT
    `.trim();
  }

  private generateExpirationEmailHTML(
    recipientName: string,
    courseName: string,
    expirationDate: string,
    daysRemaining: number,
    completion: number,
  ): string {
    const urgencyColor = daysRemaining === 1 ? '#dc2626' : '#ea580c';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .warning-box { background: ${urgencyColor}; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
    .progress-bar { background: #e5e7eb; height: 24px; border-radius: 12px; overflow: hidden; margin: 10px 0; }
    .progress-fill { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⚠️ Aviso de Expiração</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Sistema AKCIT</p>
    </div>
    <div class="content">
      <p>Olá <strong>${recipientName}</strong>,</p>

      <div class="warning-box">
        <h2 style="margin: 0 0 10px 0;">Curso expira em ${daysRemaining} dia(s)!</h2>
        <p style="margin: 0;"><strong>${courseName}</strong></p>
        <p style="margin: 10px 0 0 0;">Data de expiração: ${expirationDate}</p>
      </div>

      <div class="info-box">
        <h3 style="margin: 0 0 15px 0;">Status Atual</h3>
        <p style="margin: 0 0 10px 0;"><strong>Progresso do Curso:</strong></p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${completion}%;">${completion}%</div>
        </div>
        ${
          completion < 100
            ? `<p style="margin: 15px 0 0 0; color: ${urgencyColor};">⚠️ Faltam ${100 - completion}% para conclusão</p>`
            : '<p style="margin: 15px 0 0 0; color: #16a34a;">✅ Curso concluído</p>'
        }
      </div>

      ${
        completion < 100
          ? '<p><strong>Atenção:</strong> Por favor, certifique-se de concluir o curso antes da data de expiração.</p>'
          : ''
      }

      <div class="footer">
        <p>Este é um email automático do Sistema de Gestão AKCIT.</p>
        <p>Não responda a este email.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  async getEmailLogs(filters: EmailLogFiltersDto) {
    const { type, status, courseId, search, page = 1, limit = 20 } = filters;

    const queryBuilder = this.emailLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.course', 'course')
      .leftJoinAndSelect('log.recipientUser', 'recipientUser')
      .orderBy('log.createdAt', 'DESC');

    if (type) {
      queryBuilder.andWhere('log.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('log.status = :status', { status });
    }

    if (courseId) {
      queryBuilder.andWhere('log.course.id = :courseId', { courseId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(log.recipientEmail LIKE :search OR log.recipientName LIKE :search OR log.subject LIKE :search OR course.name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEmailLogById(id: string): Promise<EmailLog | null> {
    return await this.emailLogRepository.findOne({
      where: { id },
      relations: ['course', 'recipientUser'],
    });
  }

  async getEmailStats() {
    const total = await this.emailLogRepository.count();
    const sent = await this.emailLogRepository.count({
      where: { status: EmailStatus.SENT },
    });
    const failed = await this.emailLogRepository.count({
      where: { status: EmailStatus.FAILED },
    });
    const pending = await this.emailLogRepository.count({
      where: { status: EmailStatus.PENDING },
    });

    // Emails por tipo
    const byType = await this.emailLogRepository
      .createQueryBuilder('log')
      .select('log.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.type')
      .getRawMany();

    // Emails dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last30Days = await this.emailLogRepository.count({
      where: {
        createdAt: Between(thirtyDaysAgo, new Date()) as any,
      },
    });

    return {
      total,
      sent,
      failed,
      pending,
      byType,
      last30Days,
    };
  }
}
