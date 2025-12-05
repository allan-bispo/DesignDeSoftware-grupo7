import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
  IsArray,
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

  @IsUUID()
  @IsOptional()
  responsibleId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  assignedUserIds?: string[];
}
