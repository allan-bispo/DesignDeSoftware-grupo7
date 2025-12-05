import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateLearningTrailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  objectives?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;
}
