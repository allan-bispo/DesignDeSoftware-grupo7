import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
import { SendTestEmailDto } from './dto/send-test-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SingleResponse } from '../common/interfaces/response.interface';

@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('settings')
  async getSettings(): Promise<SingleResponse<any>> {
    const settings = await this.emailService.getSettingsSanitized();
    return { data: settings };
  }

  @Put('settings')
  async updateSettings(
    @Body() updateDto: UpdateEmailSettingsDto,
  ): Promise<SingleResponse<any>> {
    const settings = await this.emailService.updateSettings(updateDto);
    const sanitized = await this.emailService.getSettingsSanitized();
    return { data: sanitized };
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  async sendTestEmail(
    @Body() sendTestEmailDto: SendTestEmailDto,
  ): Promise<SingleResponse<any>> {
    const result = await this.emailService.sendTestEmail(sendTestEmailDto);
    return { data: result };
  }
}
