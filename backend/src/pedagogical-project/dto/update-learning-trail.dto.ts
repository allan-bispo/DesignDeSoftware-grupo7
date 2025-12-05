import { PartialType } from '@nestjs/mapped-types';
import { CreateLearningTrailDto } from './create-learning-trail.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLearningTrailDto extends PartialType(CreateLearningTrailDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
