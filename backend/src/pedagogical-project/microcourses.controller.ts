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
import { MicrocoursesService } from './microcourses.service';
import { CreateMicrocourseDto } from './dto/create-microcourse.dto';
import { UpdateMicrocourseDto } from './dto/update-microcourse.dto';
import { MicrocourseFiltersDto } from './dto/microcourse-filters.dto';
import {
  SingleResponse,
  PaginatedResponse,
} from '../common/interfaces/response.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('microcourses')
@UseGuards(JwtAuthGuard)
export class MicrocoursesController {
  constructor(private readonly microcoursesService: MicrocoursesService) {}

  @Post()
  @Roles('admin', 'instructor')
  async create(
    @Body() createMicrocourseDto: CreateMicrocourseDto,
  ): Promise<SingleResponse<any>> {
    const microcourse = await this.microcoursesService.create(createMicrocourseDto);
    return { data: microcourse };
  }

  @Get()
  async findAll(
    @Query() filters: MicrocourseFiltersDto,
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

    return await this.microcoursesService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SingleResponse<any>> {
    const microcourse = await this.microcoursesService.findOne(id);
    return { data: microcourse };
  }

  @Put(':id')
  @Roles('admin', 'instructor')
  async update(
    @Param('id') id: string,
    @Body() updateMicrocourseDto: UpdateMicrocourseDto,
  ): Promise<SingleResponse<any>> {
    const microcourse = await this.microcoursesService.update(id, updateMicrocourseDto);
    return { data: microcourse };
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.microcoursesService.remove(id);
  }
}

