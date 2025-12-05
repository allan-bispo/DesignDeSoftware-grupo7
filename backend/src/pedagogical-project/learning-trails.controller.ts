import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LearningTrailsService } from './learning-trails.service';
import { CreateLearningTrailDto } from './dto/create-learning-trail.dto';
import { UpdateLearningTrailDto } from './dto/update-learning-trail.dto';
import {
  SingleResponse,
  PaginatedResponse,
} from '../common/interfaces/response.interface';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('learning-trails')
export class LearningTrailsController {
  constructor(private readonly learningTrailsService: LearningTrailsService) {}

  @Post()
  @Roles('admin', 'instructor')
  async create(
    @Body() createLearningTrailDto: CreateLearningTrailDto,
  ): Promise<SingleResponse<any>> {
    const learningTrail = await this.learningTrailsService.create(createLearningTrailDto);
    return { data: learningTrail };
  }

  @Get()
  async findAll(): Promise<PaginatedResponse<any>> {
    return await this.learningTrailsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SingleResponse<any>> {
    const learningTrail = await this.learningTrailsService.findOne(id);
    return { data: learningTrail };
  }

  @Put(':id')
  @Roles('admin', 'instructor')
  async update(
    @Param('id') id: string,
    @Body() updateLearningTrailDto: UpdateLearningTrailDto,
  ): Promise<SingleResponse<any>> {
    const learningTrail = await this.learningTrailsService.update(id, updateLearningTrailDto);
    return { data: learningTrail };
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.learningTrailsService.remove(id);
  }
}
