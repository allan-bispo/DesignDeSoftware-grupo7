import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Microcourse } from './entities/microcourse.entity';
import { LearningTrail } from './entities/learning-trail.entity';
import { ThematicArea } from './entities/thematic-area.entity';
import { ValidationWorkflow } from './entities/validation-workflow.entity';
import { MicrocoursesController } from './microcourses.controller';
import { MicrocoursesService } from './microcourses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Microcourse,
      LearningTrail,
      ThematicArea,
      ValidationWorkflow,
    ]),
  ],
  controllers: [MicrocoursesController],
  providers: [MicrocoursesService],
  exports: [TypeOrmModule, MicrocoursesService],
})
export class PedagogicalProjectModule {}
