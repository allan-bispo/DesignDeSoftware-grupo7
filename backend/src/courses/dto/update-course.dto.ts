import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  syllabus?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  workload?: number;

  @IsDateString()
  @IsOptional()
  expirationDate?: string;
}
