import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, TrainingType } from './entities/course.entity';
import { ChecklistItem } from './entities/checklist-item.entity';
import { ActionHistory } from './entities/action-history.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFiltersDto } from './dto/course-filters.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(ChecklistItem)
    private readonly checklistRepository: Repository<ChecklistItem>,
    @InjectRepository(ActionHistory)
    private readonly actionHistoryRepository: Repository<ActionHistory>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      responsible: createCourseDto.responsible,
      trainingType: createCourseDto.trainingType as TrainingType,
      deliveryDate: new Date(createCourseDto.deliveryDate),
      duration: createCourseDto.duration,
      modules: createCourseDto.modules,
      projectNotes: createCourseDto.projectNotes,
      completion: 0,
    });

    const savedCourse = await this.courseRepository.save(course);

    // Cria checklist inicial
    const checklistItems = [
      { label: 'Folder/card do AVA', completed: false, course: savedCourse },
      { label: 'Escrita do Ebook/Data', completed: false, course: savedCourse },
      { label: 'Ilustrações Ebook', completed: false, course: savedCourse },
    ];
    await this.checklistRepository.save(
      checklistItems.map((item) => this.checklistRepository.create(item)),
    );

    // Cria histórico de ação
    const actionHistory = this.actionHistoryRepository.create({
      action: 'Curso criado',
      user: createCourseDto.responsible,
      timestamp: new Date(),
      course: savedCourse,
    });
    await this.actionHistoryRepository.save(actionHistory);

    return this.findOne(savedCourse.id);
  }

  async findAll(filters: CourseFiltersDto) {
    const {
      search,
      responsible,
      trainingType,
      period,
      page = 1,
      limit = 10,
    } = filters;

    const queryBuilder = this.courseRepository.createQueryBuilder('course');

    if (search) {
      queryBuilder.where(
        '(course.name LIKE :search OR course.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (responsible) {
      queryBuilder.andWhere('course.responsible = :responsible', {
        responsible,
      });
    }

    if (trainingType) {
      queryBuilder.andWhere('course.trainingType = :trainingType', {
        trainingType,
      });
    }

    if (period) {
      // Implementar lógica de período se necessário
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .leftJoinAndSelect('course.checklist', 'checklist')
      .skip(skip)
      .take(limit)
      .orderBy('course.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    // Garante que checklist sempre seja um array
    data.forEach((course) => {
      if (!course.checklist) {
        course.checklist = [];
      }
    });

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

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['checklist', 'usefulLinks', 'comments', 'actionHistory'],
    });

    if (!course) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado.`);
    }

    // Garante que checklist sempre seja um array
    if (!course.checklist) {
      course.checklist = [];
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // Atualiza apenas os campos fornecidos
    if (updateCourseDto.name !== undefined) {
      course.name = updateCourseDto.name;
    }
    if (updateCourseDto.description !== undefined) {
      course.description = updateCourseDto.description;
    }
    if (updateCourseDto.responsible !== undefined) {
      course.responsible = updateCourseDto.responsible;
    }
    if (updateCourseDto.trainingType !== undefined) {
      course.trainingType = updateCourseDto.trainingType as TrainingType;
    }
    if (updateCourseDto.deliveryDate !== undefined) {
      course.deliveryDate = new Date(updateCourseDto.deliveryDate);
    }
    if (updateCourseDto.duration !== undefined) {
      course.duration = updateCourseDto.duration;
    }
    if (updateCourseDto.modules !== undefined) {
      course.modules = updateCourseDto.modules;
    }
    if (updateCourseDto.projectNotes !== undefined) {
      course.projectNotes = updateCourseDto.projectNotes;
    }
    if (updateCourseDto.completion !== undefined) {
      course.completion = updateCourseDto.completion;
    }

    const updatedCourse = await this.courseRepository.save(course);
    return this.findOne(updatedCourse.id);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }

  async getStats() {
    const courses = await this.courseRepository.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = courses.length;
    const inProgress = courses.filter(
      (c) => c.completion > 0 && c.completion < 100,
    ).length;
    const completed = courses.filter((c) => c.completion === 100).length;
    const delayed = courses.filter((c) => {
      const deliveryDate = new Date(c.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate < today && c.completion < 100;
    }).length;

    const averageCompletion =
      courses.length > 0
        ? Math.round(
            courses.reduce((sum, c) => sum + c.completion, 0) / courses.length,
          )
        : 0;

    return {
      total,
      inProgress,
      completed,
      delayed,
      averageCompletion,
    };
  }
}
