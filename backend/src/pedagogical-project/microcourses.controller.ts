import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MicrocoursesService } from './microcourses.service';
import { CreateMicrocourseDto } from './dto/create-microcourse.dto';
import { UpdateMicrocourseDto } from './dto/update-microcourse.dto';
import { MicrocourseFiltersDto } from './dto/microcourse-filters.dto';
import {
  SingleResponse,
  PaginatedResponse,
} from '../common/interfaces/response.interface';

@Controller('microcourses')
export class MicrocoursesController {
  constructor(private readonly microcoursesService: MicrocoursesService) {}

  @Post()
  async create(
    @Body() createMicrocourseDto: CreateMicrocourseDto,
  ): Promise<SingleResponse<any>> {
    const microcourse = await this.microcoursesService.create(createMicrocourseDto);
    return { data: microcourse };
  }

  @Get()
  async findAll(
    @Query() filters: MicrocourseFiltersDto,
  ): Promise<PaginatedResponse<any>> {
    return await this.microcoursesService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SingleResponse<any>> {
    const microcourse = await this.microcoursesService.findOne(id);
    return { data: microcourse };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMicrocourseDto: UpdateMicrocourseDto,
  ): Promise<SingleResponse<any>> {
    const microcourse = await this.microcoursesService.update(id, updateMicrocourseDto);
    return { data: microcourse };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.microcoursesService.remove(id);
  }
}

