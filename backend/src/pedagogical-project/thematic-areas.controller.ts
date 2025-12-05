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
import { ThematicAreasService } from './thematic-areas.service';
import { CreateThematicAreaDto } from './dto/create-thematic-area.dto';
import { UpdateThematicAreaDto } from './dto/update-thematic-area.dto';
import {
  SingleResponse,
  PaginatedResponse,
} from '../common/interfaces/response.interface';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('thematic-areas')
export class ThematicAreasController {
  constructor(private readonly thematicAreasService: ThematicAreasService) {}

  @Post()
  @Roles('admin', 'instructor')
  async create(
    @Body() createThematicAreaDto: CreateThematicAreaDto,
  ): Promise<SingleResponse<any>> {
    const thematicArea = await this.thematicAreasService.create(createThematicAreaDto);
    return { data: thematicArea };
  }

  @Get()
  async findAll(): Promise<PaginatedResponse<any>> {
    return await this.thematicAreasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SingleResponse<any>> {
    const thematicArea = await this.thematicAreasService.findOne(id);
    return { data: thematicArea };
  }

  @Put(':id')
  @Roles('admin', 'instructor')
  async update(
    @Param('id') id: string,
    @Body() updateThematicAreaDto: UpdateThematicAreaDto,
  ): Promise<SingleResponse<any>> {
    const thematicArea = await this.thematicAreasService.update(id, updateThematicAreaDto);
    return { data: thematicArea };
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.thematicAreasService.remove(id);
  }
}
