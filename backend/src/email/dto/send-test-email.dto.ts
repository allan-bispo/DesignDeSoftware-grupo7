import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SendTestEmailDto {
  @IsEmail()
  @IsNotEmpty()
  recipientEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  body: string;
}
