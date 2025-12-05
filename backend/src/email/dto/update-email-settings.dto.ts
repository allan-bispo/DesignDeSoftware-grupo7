import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateEmailSettingsDto {
  @IsString()
  @IsOptional()
  @MinLength(16)
  awsAccessKeyId?: string;

  @IsString()
  @IsOptional()
  @MinLength(16)
  awsSecretAccessKey?: string;

  @IsString()
  @IsOptional()
  awsRegion?: string;

  @IsEmail()
  @IsOptional()
  senderEmail?: string;

  @IsString()
  @IsOptional()
  senderName?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
