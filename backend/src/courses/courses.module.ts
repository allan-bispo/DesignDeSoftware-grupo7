import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { ChecklistItem } from './entities/checklist-item.entity';
import { UsefulLink } from './entities/useful-link.entity';
import { Comment } from './entities/comment.entity';
import { ActionHistory } from './entities/action-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      ChecklistItem,
      UsefulLink,
      Comment,
      ActionHistory,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
