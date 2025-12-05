import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Microcourse, MicrocourseStatus } from './entities/microcourse.entity';
import { CreateMicrocourseDto } from './dto/create-microcourse.dto';
import { UpdateMicrocourseDto } from './dto/update-microcourse.dto';
import { MicrocourseFiltersDto } from './dto/microcourse-filters.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MicrocoursesService {
  constructor(
    @InjectRepository(Microcourse)
    private readonly microcourseRepository: Repository<Microcourse>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    // Atribuir usuários ao microcurso
    if (createMicrocourseDto.assignedUserIds && createMicrocourseDto.assignedUserIds.length > 0) {
      const users = await this.userRepository.findBy({
        id: In(createMicrocourseDto.assignedUserIds),
      });
      microcourse.assignedUsers = users;
    }

    return await this.microcourseRepository.save(microcourse);
  }

  async findAll(filters: MicrocourseFiltersDto) {
    const {
      search,
      status,
      thematicAreaId,
      learningTrailId,
      userId,
      page = 1,
      limit = 100,
    } = filters;

    const queryBuilder = this.microcourseRepository.createQueryBuilder('microcourse');

    // Carrega relações
    queryBuilder
      .leftJoinAndSelect('microcourse.thematicArea', 'thematicArea')
      .leftJoinAndSelect('microcourse.learningTrail', 'learningTrail')
      .leftJoinAndSelect('microcourse.coordinator', 'coordinator')
      .leftJoinAndSelect('microcourse.assignedUsers', 'assignedUsers');

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

    // Filtrar por usuário atribuído
    if (userId) {
      queryBuilder.andWhere('assignedUsers.id = :userId', { userId });
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
        'assignedUsers',
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

    // Atualizar campos básicos
    const { assignedUserIds, ...basicFields } = updateMicrocourseDto;
    Object.assign(microcourse, basicFields);

    // Atualizar usuários atribuídos, se fornecido
    if (assignedUserIds !== undefined) {
      if (assignedUserIds.length > 0) {
        const users = await this.userRepository.findBy({
          id: In(assignedUserIds),
        });
        microcourse.assignedUsers = users;
      } else {
        microcourse.assignedUsers = [];
      }
    }

    return await this.microcourseRepository.save(microcourse);
  }

  async remove(id: string): Promise<void> {
    const microcourse = await this.findOne(id);
    await this.microcourseRepository.remove(microcourse);
  }
}

