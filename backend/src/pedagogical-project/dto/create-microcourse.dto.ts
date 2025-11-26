import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { PedagogicalApproach, MicrocourseStatus } from '../entities/microcourse.entity';

export class CreateMicrocourseDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  syllabus: string;

  @IsString()
  @IsOptional()
  expectedCompetencies?: string;

  @IsString()
  @IsOptional()
  graduateProfile?: string;

  @IsString()
  @IsOptional()
  bibliography?: string;

  @IsNumber()
  workload: number;

  @IsEnum(PedagogicalApproach)
  pedagogicalApproach: PedagogicalApproach;

  @IsEnum(MicrocourseStatus)
  @IsOptional()
  status?: MicrocourseStatus;

  @IsString()
  @IsOptional()
  programContent?: string;

  @IsString()
  @IsOptional()
  evaluationMethods?: string;

  @IsString()
  @IsOptional()
  teachingStrategies?: string;

  @IsUUID()
  @IsOptional()
  learningTrailId?: string;

  @IsUUID()
  @IsOptional()
  thematicAreaId?: string;

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;
}

