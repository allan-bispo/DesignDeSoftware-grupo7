import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
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
}
