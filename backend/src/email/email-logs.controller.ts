import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmailNotificationsService } from './email-notifications.service';
import { EmailLogFiltersDto } from './dto/email-log-filters.dto';

@Controller('email/logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class EmailLogsController {
  constructor(
    private readonly emailNotificationsService: EmailNotificationsService,
  ) {}

  @Get()
  async getEmailLogs(@Query() filters: EmailLogFiltersDto) {
    return await this.emailNotificationsService.getEmailLogs(filters);
  }

  @Get('stats')
  async getEmailStats() {
    return await this.emailNotificationsService.getEmailStats();
  }

  @Get(':id')
  async getEmailLogById(@Param('id') id: string) {
    const log = await this.emailNotificationsService.getEmailLogById(id);

    if (!log) {
      throw new NotFoundException(`Email log with ID ${id} not found`);
    }

    return log;
  }
}
