import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { LibraryItem } from './entities/library-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryItem])],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
