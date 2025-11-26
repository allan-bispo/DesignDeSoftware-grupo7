import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Microcourse, MicrocourseStatus } from './entities/microcourse.entity';
import { CreateMicrocourseDto } from './dto/create-microcourse.dto';
import { UpdateMicrocourseDto } from './dto/update-microcourse.dto';
import { MicrocourseFiltersDto } from './dto/microcourse-filters.dto';

@Injectable()
export class MicrocoursesService {
  constructor(
    @InjectRepository(Microcourse)
    private readonly microcourseRepository: Repository<Microcourse>,
  ) {}

  async create(createMicrocourseDto: CreateMicrocourseDto): Promise<Microcourse> {
    const microcourseData: Partial<Microcourse> = {
      name: createMicrocourseDto.name,
      description: createMicrocourseDto.description,
      syllabus: createMicrocourseDto.syllabus,
      expectedCompetencies: createMicrocourseDto.expectedCompetencies,
      graduateProfile: createMicrocourseDto.graduateProfile,
      bibliography: createMicrocourseDto.bibliography,
      workload: createMicrocourseDto.workload,
      pedagogicalApproach: createMicrocourseDto.pedagogicalApproach,
      status: createMicrocourseDto.status || MicrocourseStatus.DRAFT,
      programContent: createMicrocourseDto.programContent,
      evaluationMethods: createMicrocourseDto.evaluationMethods,
      teachingStrategies: createMicrocourseDto.teachingStrategies,
    };

    if (createMicrocourseDto.thematicAreaId) {
      microcourseData.thematicArea = { id: createMicrocourseDto.thematicAreaId } as any;
    }

    if (createMicrocourseDto.learningTrailId) {
      microcourseData.learningTrail = { id: createMicrocourseDto.learningTrailId } as any;
    }

    if (createMicrocourseDto.coordinatorId) {
      microcourseData.coordinator = { id: createMicrocourseDto.coordinatorId } as any;
    }

    const microcourse = this.microcourseRepository.create(microcourseData);
    return await this.microcourseRepository.save(microcourse);
  }

  async findAll(filters: MicrocourseFiltersDto) {
    const {
      search,
      status,
      thematicAreaId,
      learningTrailId,
      page = 1,
      limit = 100,
    } = filters;

    const queryBuilder = this.microcourseRepository.createQueryBuilder('microcourse');

    // Carrega relações
    queryBuilder
      .leftJoinAndSelect('microcourse.thematicArea', 'thematicArea')
      .leftJoinAndSelect('microcourse.learningTrail', 'learningTrail')
      .leftJoinAndSelect('microcourse.coordinator', 'coordinator');

    // Filtros
    if (search) {
      queryBuilder.where(
        '(microcourse.name LIKE :search OR microcourse.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('microcourse.status = :status', { status });
    }

    if (thematicAreaId) {
      queryBuilder.andWhere('microcourse.thematicArea.id = :thematicAreaId', {
        thematicAreaId,
      });
    }

    if (learningTrailId) {
      queryBuilder.andWhere('microcourse.learningTrail.id = :learningTrailId', {
        learningTrailId,
      });
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('microcourse.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Microcourse> {
    const microcourse = await this.microcourseRepository.findOne({
      where: { id },
      relations: [
        'thematicArea',
        'learningTrail',
        'coordinator',
        'prerequisites',
        'validationWorkflows',
      ],
    });

    if (!microcourse) {
      throw new NotFoundException(`Microcurso com ID ${id} não encontrado.`);
    }

    return microcourse;
  }

  async update(
    id: string,
    updateMicrocourseDto: UpdateMicrocourseDto,
  ): Promise<Microcourse> {
    const microcourse = await this.findOne(id);

    Object.assign(microcourse, updateMicrocourseDto);

    return await this.microcourseRepository.save(microcourse);
  }

  async remove(id: string): Promise<void> {
    const microcourse = await this.findOne(id);
    await this.microcourseRepository.remove(microcourse);
  }
}

