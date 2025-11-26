import { PartialType } from '@nestjs/mapped-types';
import { CreateMicrocourseDto } from './create-microcourse.dto';

export class UpdateMicrocourseDto extends PartialType(CreateMicrocourseDto) {}

