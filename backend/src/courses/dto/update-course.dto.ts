import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsIn,
  Min,
  Max,
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
  responsible?: string;

  @IsString()
  @IsIn([
    'Frontend',
    'Backend',
    'Fullstack',
    'DevOps',
    'Mobile',
    'Data Science',
  ])
  @IsOptional()
  trainingType?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  modules?: number;

  @IsString()
  @IsOptional()
  projectNotes?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  completion?: number;
}
