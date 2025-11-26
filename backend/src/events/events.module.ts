import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventTeamMember } from './entities/event-team-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventTeamMember])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class EventsModule {}
