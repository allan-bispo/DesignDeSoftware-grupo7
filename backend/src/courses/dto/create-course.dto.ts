import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsIn,
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
  responsible: string;

  @IsString()
  @IsIn([
    'Frontend',
    'Backend',
    'Fullstack',
    'DevOps',
    'Mobile',
    'Data Science',
  ])
  trainingType: string;

  @IsDateString()
  @IsNotEmpty()
  deliveryDate: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsNumber()
  @Min(0)
  modules: number;

  @IsString()
  @IsNotEmpty()
  projectNotes: string;
}
