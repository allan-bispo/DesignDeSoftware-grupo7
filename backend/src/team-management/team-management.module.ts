import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { TaskAssignment } from './entities/task-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamMember, TaskAssignment]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class TeamManagementModule {}
