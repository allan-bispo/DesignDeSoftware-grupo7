import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  // POST /cursos
  @Post()
  async create(@Body() createCursoDto: CreateCursoDto) {
    return await this.cursosService.create(createCursoDto);
  }

  @Get()
  async findAll() {
    return await this.cursosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.cursosService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCursoDto: UpdateCursoDto,
  ) {
    return await this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.cursosService.remove(id);
  }
}
