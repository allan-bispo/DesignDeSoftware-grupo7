import { Controller, Get, Query } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryFiltersDto } from './dto/library-filters.dto';
import { PaginatedResponse } from '../common/interfaces/response.interface';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  async findAll(
    @Query() filters: LibraryFiltersDto,
  ): Promise<PaginatedResponse<any>> {
    return await this.libraryService.findAll(filters);
  }
}
