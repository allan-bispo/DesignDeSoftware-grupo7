import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailLogsController } from './email-logs.controller';
import { EmailNotificationsService } from './email-notifications.service';
import { EmailSettings } from './entities/email-settings.entity';
import { EmailLog } from './entities/email-log.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([EmailSettings, EmailLog, Course]),
  ],
  controllers: [EmailController, EmailLogsController],
  providers: [EmailService, EmailNotificationsService],
  exports: [EmailService],
})
export class EmailModule {}
