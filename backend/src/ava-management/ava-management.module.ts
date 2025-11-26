import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseClass } from './entities/course-class.entity';
import { ForumTopic } from './entities/forum-topic.entity';
import { ForumPost } from './entities/forum-post.entity';
import { QuestionBank } from './entities/question-bank.entity';
import { Question } from './entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseClass,
      ForumTopic,
      ForumPost,
      QuestionBank,
      Question,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class AvaManagementModule {}
