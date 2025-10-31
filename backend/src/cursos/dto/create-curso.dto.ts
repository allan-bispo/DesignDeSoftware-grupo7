import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  targetDate: Date;
}
