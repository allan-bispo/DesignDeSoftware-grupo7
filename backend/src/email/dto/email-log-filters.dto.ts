import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { EmailType, EmailStatus } from '../entities/email-log.entity';
import { Type } from 'class-transformer';

export class EmailLogFiltersDto {
  @IsOptional()
  @IsEnum(EmailType)
  type?: EmailType;

  @IsOptional()
  @IsEnum(EmailStatus)
  status?: EmailStatus;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
