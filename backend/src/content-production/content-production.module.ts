import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachingPlan } from './entities/teaching-plan.entity';
import { Ebook } from './entities/ebook.entity';
import { VideoLesson } from './entities/video-lesson.entity';
import { DidacticMaterial } from './entities/didactic-material.entity';
import { VisualIdentity } from './entities/visual-identity.entity';
import { ContentReview } from './entities/content-review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeachingPlan,
      Ebook,
      VideoLesson,
      DidacticMaterial,
      VisualIdentity,
      ContentReview,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ContentProductionModule {}
