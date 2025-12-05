import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Microcourse } from './entities/microcourse.entity';
import { LearningTrail } from './entities/learning-trail.entity';
import { ThematicArea } from './entities/thematic-area.entity';
import { ValidationWorkflow } from './entities/validation-workflow.entity';
import { User } from '../users/entities/user.entity';
import { MicrocoursesController } from './microcourses.controller';
import { MicrocoursesService } from './microcourses.service';
import { ThematicAreasController } from './thematic-areas.controller';
import { ThematicAreasService } from './thematic-areas.service';
import { LearningTrailsController } from './learning-trails.controller';
import { LearningTrailsService } from './learning-trails.service';
// Pedagogical Project Module - Educational content management

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Microcourse,
      LearningTrail,
      ThematicArea,
      ValidationWorkflow,
      User,
    ]),
  ],
  controllers: [
    MicrocoursesController,
    ThematicAreasController,
    LearningTrailsController,
  ],
  providers: [
    MicrocoursesService,
    ThematicAreasService,
    LearningTrailsService,
  ],
  exports: [
    TypeOrmModule,
    MicrocoursesService,
    ThematicAreasService,
    LearningTrailsService,
  ],
})
export class PedagogicalProjectModule {}
