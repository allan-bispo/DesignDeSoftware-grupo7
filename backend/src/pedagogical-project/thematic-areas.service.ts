import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThematicArea } from './entities/thematic-area.entity';
import { CreateThematicAreaDto } from './dto/create-thematic-area.dto';
import { UpdateThematicAreaDto } from './dto/update-thematic-area.dto';

@Injectable()
export class ThematicAreasService {
  constructor(
    @InjectRepository(ThematicArea)
    private readonly thematicAreaRepository: Repository<ThematicArea>,
  ) {}

  async create(createThematicAreaDto: CreateThematicAreaDto) {
    const thematicArea = this.thematicAreaRepository.create({
      name: createThematicAreaDto.name,
      description: createThematicAreaDto.description,
      coordinator: createThematicAreaDto.coordinatorId
        ? { id: createThematicAreaDto.coordinatorId } as any
        : undefined,
    });

    return await this.thematicAreaRepository.save(thematicArea);
  }

  async findAll() {
    const thematicAreas = await this.thematicAreaRepository.find({
      relations: ['coordinator', 'microcourses'],
      order: { name: 'ASC' },
    });

    return {
      data: thematicAreas,
      pagination: {
        page: 1,
        limit: thematicAreas.length,
        total: thematicAreas.length,
        totalPages: 1,
      },
    };
  }

  async findOne(id: string) {
    const thematicArea = await this.thematicAreaRepository.findOne({
      where: { id },
      relations: ['coordinator', 'microcourses'],
    });

    if (!thematicArea) {
      throw new NotFoundException(`Área temática com ID ${id} não encontrada`);
    }

    return thematicArea;
  }

  async update(id: string, updateThematicAreaDto: UpdateThematicAreaDto) {
    const thematicArea = await this.findOne(id);

    if (updateThematicAreaDto.name !== undefined) {
      thematicArea.name = updateThematicAreaDto.name;
    }
    if (updateThematicAreaDto.description !== undefined) {
      thematicArea.description = updateThematicAreaDto.description;
    }
    if (updateThematicAreaDto.isActive !== undefined) {
      thematicArea.isActive = updateThematicAreaDto.isActive;
    }
    if (updateThematicAreaDto.coordinatorId !== undefined) {
      thematicArea.coordinator = updateThematicAreaDto.coordinatorId
        ? { id: updateThematicAreaDto.coordinatorId } as any
        : undefined;
    }

    return await this.thematicAreaRepository.save(thematicArea);
  }

  async remove(id: string) {
    const thematicArea = await this.findOne(id);
    await this.thematicAreaRepository.remove(thematicArea);
  }
}
