import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailSettings } from './entities/email-settings.entity';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
import { SendTestEmailDto } from './dto/send-test-email.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailSettings)
    private readonly emailSettingsRepository: Repository<EmailSettings>,
  ) {}

  async getSettings(): Promise<EmailSettings> {
    // Sempre retorna a primeira configuração (única no sistema)
    let settings = await this.emailSettingsRepository.findOne({
      where: {},
    });

    if (!settings) {
      // Cria configuração inicial se não existir
      settings = this.emailSettingsRepository.create({
        isEnabled: false,
        isConfigured: false,
        awsRegion: 'us-east-1', // região padrão
      });
      await this.emailSettingsRepository.save(settings);
    }

    return settings;
  }

  async updateSettings(
    updateDto: UpdateEmailSettingsDto,
  ): Promise<EmailSettings> {
    const settings = await this.getSettings();

    // Atualiza apenas os campos fornecidos
    if (updateDto.awsAccessKeyId !== undefined) {
      settings.awsAccessKeyId = updateDto.awsAccessKeyId;
    }
    if (updateDto.awsSecretAccessKey !== undefined) {
      settings.awsSecretAccessKey = updateDto.awsSecretAccessKey;
    }
    if (updateDto.awsRegion !== undefined) {
      settings.awsRegion = updateDto.awsRegion;
    }
    if (updateDto.senderEmail !== undefined) {
      settings.senderEmail = updateDto.senderEmail;
    }
    if (updateDto.senderName !== undefined) {
      settings.senderName = updateDto.senderName;
    }
    if (updateDto.isEnabled !== undefined) {
      settings.isEnabled = updateDto.isEnabled;
    }

    // Verifica se está configurado
    settings.isConfigured = !!(
      settings.awsAccessKeyId &&
      settings.awsSecretAccessKey &&
      settings.awsRegion &&
      settings.senderEmail
    );

    return await this.emailSettingsRepository.save(settings);
  }

  async sendTestEmail(sendTestEmailDto: SendTestEmailDto): Promise<any> {
    const settings = await this.getSettings();

    if (!settings.isConfigured) {
      throw new BadRequestException(
        'As configurações de email não estão completas.',
      );
    }

    if (!settings.isEnabled) {
      throw new BadRequestException('O serviço de email está desabilitado.');
    }

    // Configura AWS SES
    AWS.config.update({
      accessKeyId: settings.awsAccessKeyId || undefined,
      secretAccessKey: settings.awsSecretAccessKey || undefined,
      region: settings.awsRegion || undefined,
    });

    const ses = new AWS.SES({ apiVersion: '2010-12-01' });

    const params = {
      Source: settings.senderName
        ? `${settings.senderName} <${settings.senderEmail}>`
        : (settings.senderEmail || ''),
      Destination: {
        ToAddresses: [sendTestEmailDto.recipientEmail],
      },
      Message: {
        Subject: {
          Data: sendTestEmailDto.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: sendTestEmailDto.body,
            Charset: 'UTF-8',
          },
          Html: {
            Data: `<html><body>${sendTestEmailDto.body.replace(/\n/g, '<br>')}</body></html>`,
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      const result = await ses.sendEmail(params).promise();
      return {
        success: true,
        messageId: result.MessageId,
        message: 'Email enviado com sucesso!',
      };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao enviar email: ${error.message}`,
      );
    }
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    body: string,
    html?: string,
  ): Promise<any> {
    const settings = await this.getSettings();

    if (!settings.isConfigured || !settings.isEnabled) {
      throw new BadRequestException(
        'Serviço de email não está configurado ou está desabilitado.',
      );
    }

    AWS.config.update({
      accessKeyId: settings.awsAccessKeyId || undefined,
      secretAccessKey: settings.awsSecretAccessKey || undefined,
      region: settings.awsRegion || undefined,
    });

    const ses = new AWS.SES({ apiVersion: '2010-12-01' });

    const toAddresses = Array.isArray(to) ? to : [to];

    const params = {
      Source: settings.senderName
        ? `${settings.senderName} <${settings.senderEmail}>`
        : (settings.senderEmail || ''),
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: body,
            Charset: 'UTF-8',
          },
          Html: {
            Data: html || `<html><body>${body.replace(/\n/g, '<br>')}</body></html>`,
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      const result = await ses.sendEmail(params).promise();
      return {
        success: true,
        messageId: result.MessageId,
      };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao enviar email: ${error.message}`,
      );
    }
  }

  async getSettingsSanitized(): Promise<any> {
    const settings = await this.getSettings();

    // Remove dados sensíveis
    return {
      id: settings.id,
      awsRegion: settings.awsRegion || undefined,
      senderEmail: settings.senderEmail || undefined,
      senderName: settings.senderName || undefined,
      isEnabled: settings.isEnabled,
      isConfigured: settings.isConfigured,
      // Mostra apenas os últimos 4 caracteres das credenciais
      awsAccessKeyId: settings.awsAccessKeyId
        ? `****${settings.awsAccessKeyId.slice(-4)}`
        : undefined,
      awsSecretAccessKey: settings.awsSecretAccessKey
        ? `****${settings.awsSecretAccessKey.slice(-4)}`
        : undefined,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }
}
