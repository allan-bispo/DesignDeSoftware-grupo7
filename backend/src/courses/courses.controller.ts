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
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFiltersDto } from './dto/course-filters.dto';
import {
  SingleResponse,
  PaginatedResponse,
} from '../common/interfaces/response.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<SingleResponse<any>> {
    const course = await this.coursesService.create(createCourseDto);
    return { data: course };
  }

  @Get()
  async findAll(
    @Query() filters: CourseFiltersDto,
    @CurrentUser() user: any,
  ): Promise<PaginatedResponse<any>> {
    // Se o usuário for estudante ou tutor, filtrar apenas seus cursos
    const rolesWithRestrictedAccess = [
      UserRole.STUDENT,
      UserRole.TUTOR,
    ];

    if (user && rolesWithRestrictedAccess.includes(user.role)) {
      filters.userId = user.sub; // JWT payload usa 'sub' para user ID
    }

    return await this.coursesService.findAll(filters);
  }

  @Get('stats')
  async getStats() {
    return await this.coursesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SingleResponse<any>> {
    const course = await this.coursesService.findOne(id);
    return { data: course };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<SingleResponse<any>> {
    const course = await this.coursesService.update(id, updateCourseDto);
    return { data: course };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.coursesService.remove(id);
  }

  @Put(':courseId/checklist/:itemId')
  async updateChecklistItem(
    @Param('courseId') courseId: string,
    @Param('itemId') itemId: string,
    @Body() body: { completed: boolean },
  ): Promise<SingleResponse<any>> {
    const course = await this.coursesService.updateChecklistItem(
      courseId,
      itemId,
      body.completed,
    );
    return { data: course };
  }
}
