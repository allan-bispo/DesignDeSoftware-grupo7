import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningTrail } from './entities/learning-trail.entity';
import { CreateLearningTrailDto } from './dto/create-learning-trail.dto';
import { UpdateLearningTrailDto } from './dto/update-learning-trail.dto';

@Injectable()
export class LearningTrailsService {
  constructor(
    @InjectRepository(LearningTrail)
    private readonly learningTrailRepository: Repository<LearningTrail>,
  ) {}

  async create(createLearningTrailDto: CreateLearningTrailDto) {
    const learningTrail = this.learningTrailRepository.create({
      name: createLearningTrailDto.name,
      description: createLearningTrailDto.description,
      objectives: createLearningTrailDto.objectives,
      order: createLearningTrailDto.order || 0,
      coordinator: createLearningTrailDto.coordinatorId
        ? { id: createLearningTrailDto.coordinatorId } as any
        : undefined,
    });

    return await this.learningTrailRepository.save(learningTrail);
  }

  async findAll() {
    const learningTrails = await this.learningTrailRepository.find({
      relations: ['coordinator', 'microcourses'],
      order: { order: 'ASC', name: 'ASC' },
    });

    return {
      data: learningTrails,
      pagination: {
        page: 1,
        limit: learningTrails.length,
        total: learningTrails.length,
        totalPages: 1,
      },
    };
  }

  async findOne(id: string) {
    const learningTrail = await this.learningTrailRepository.findOne({
      where: { id },
      relations: ['coordinator', 'microcourses'],
    });

    if (!learningTrail) {
      throw new NotFoundException(`Trilha de aprendizagem com ID ${id} não encontrada`);
    }

    return learningTrail;
  }

  async update(id: string, updateLearningTrailDto: UpdateLearningTrailDto) {
    const learningTrail = await this.findOne(id);

    if (updateLearningTrailDto.name !== undefined) {
      learningTrail.name = updateLearningTrailDto.name;
    }
    if (updateLearningTrailDto.description !== undefined) {
      learningTrail.description = updateLearningTrailDto.description;
    }
    if (updateLearningTrailDto.objectives !== undefined) {
      learningTrail.objectives = updateLearningTrailDto.objectives;
    }
    if (updateLearningTrailDto.order !== undefined) {
      learningTrail.order = updateLearningTrailDto.order;
    }
    if (updateLearningTrailDto.isActive !== undefined) {
      learningTrail.isActive = updateLearningTrailDto.isActive;
    }
    if (updateLearningTrailDto.coordinatorId !== undefined) {
      learningTrail.coordinator = updateLearningTrailDto.coordinatorId
        ? { id: updateLearningTrailDto.coordinatorId } as any
        : undefined;
    }

    return await this.learningTrailRepository.save(learningTrail);
  }

  async remove(id: string) {
    const learningTrail = await this.findOne(id);
    await this.learningTrailRepository.remove(learningTrail);
  }
}
