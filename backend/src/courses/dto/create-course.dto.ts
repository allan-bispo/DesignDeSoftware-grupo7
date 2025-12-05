import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  syllabus: string;

  @IsNumber()
  @Min(1)
  workload: number;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;

  @IsUUID()
  @IsOptional()
  responsibleId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  assignedUserIds?: string[];
}
