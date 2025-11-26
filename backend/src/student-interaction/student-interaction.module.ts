import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEnrollment } from './entities/student-enrollment.entity';
import { StudentProgress } from './entities/student-progress.entity';
import { InterventionAction } from './entities/intervention-action.entity';
import { VirtualMeeting } from './entities/virtual-meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentEnrollment,
      StudentProgress,
      InterventionAction,
      VirtualMeeting,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class StudentInteractionModule {}
