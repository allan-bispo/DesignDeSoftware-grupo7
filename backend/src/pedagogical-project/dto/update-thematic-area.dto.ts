import { PartialType } from '@nestjs/mapped-types';
import { CreateThematicAreaDto } from './create-thematic-area.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateThematicAreaDto extends PartialType(CreateThematicAreaDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
