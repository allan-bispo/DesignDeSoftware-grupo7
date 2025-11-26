import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { ChecklistItem } from './entities/checklist-item.entity';
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
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      syllabus: createCourseDto.syllabus,
      workload: createCourseDto.workload,
      expirationDate: new Date(createCourseDto.expirationDate),
      completion: 0,
    });

    const savedCourse = await this.courseRepository.save(course);

    // Cria checklist inicial para determinar o andamento
    const checklistItems = [
      { label: 'Planejamento', completed: false, course: savedCourse },
      { label: 'Desenvolvimento do Conteúdo', completed: false, course: savedCourse },
      { label: 'Revisão', completed: false, course: savedCourse },
      { label: 'Publicação', completed: false, course: savedCourse },
    ];
    await this.checklistRepository.save(
      checklistItems.map((item) => this.checklistRepository.create(item)),
    );

    return this.findOne(savedCourse.id);
  }

  async findAll(filters: CourseFiltersDto) {
    const {
      search,
      page = 1,
      limit = 10,
    } = filters;

    const queryBuilder = this.courseRepository.createQueryBuilder('course');

    if (search) {
      queryBuilder.where(
        '(course.name LIKE :search OR course.description LIKE :search OR course.syllabus LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;
    queryBuilder
      .leftJoinAndSelect('course.checklist', 'checklist')
      .skip(skip)
      .take(limit)
      .orderBy('course.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    // Garante que checklist sempre seja um array e recalcula completion
    data.forEach((course) => {
      if (!course.checklist) {
        course.checklist = [];
      }
      // Recalcula completion baseado nos checkboxes
      const totalItems = course.checklist.length;
      const completedItems = course.checklist.filter((item) => item.completed).length;
      course.completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
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
      relations: ['checklist'],
    });

    if (!course) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado.`);
    }

    // Garante que checklist sempre seja um array e recalcula completion
    if (!course.checklist) {
      course.checklist = [];
    }
    const totalItems = course.checklist.length;
    const completedItems = course.checklist.filter((item) => item.completed).length;
    course.completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

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
    if (updateCourseDto.syllabus !== undefined) {
      course.syllabus = updateCourseDto.syllabus;
    }
    if (updateCourseDto.workload !== undefined) {
      course.workload = updateCourseDto.workload;
    }
    if (updateCourseDto.expirationDate !== undefined) {
      course.expirationDate = new Date(updateCourseDto.expirationDate);
    }

    const updatedCourse = await this.courseRepository.save(course);
    return this.findOne(updatedCourse.id);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }

  async updateChecklistItem(
    courseId: string,
    itemId: string,
    completed: boolean,
  ): Promise<Course> {
    // Busca o curso
    const course = await this.findOne(courseId);

    // Atualiza o item da checklist
    const checklistItem = await this.checklistRepository.findOne({
      where: { id: itemId },
    });

    if (!checklistItem) {
      throw new NotFoundException(
        `Item da checklist com ID ${itemId} não encontrado.`,
      );
    }

    checklistItem.completed = completed;
    await this.checklistRepository.save(checklistItem);

    // Recalcula a porcentagem de conclusão
    const updatedCourse = await this.findOne(courseId);
    const totalItems = updatedCourse.checklist.length;
    const completedItems = updatedCourse.checklist.filter(
      (item) => item.completed,
    ).length;
    const completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Atualiza a porcentagem de conclusão do curso
    updatedCourse.completion = completion;
    await this.courseRepository.save(updatedCourse);

    return this.findOne(courseId);
  }

  async getStats() {
    const courses = await this.courseRepository.find({
      relations: ['checklist'],
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Recalcula completion para todos os cursos
    courses.forEach((course) => {
      const totalItems = course.checklist?.length || 0;
      const completedItems = course.checklist?.filter((item) => item.completed).length || 0;
      course.completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    });

    const total = courses.length;
    const inProgress = courses.filter(
      (c) => c.completion > 0 && c.completion < 100,
    ).length;
    const completed = courses.filter((c) => c.completion === 100).length;
    const delayed = courses.filter((c) => {
      const expirationDate = new Date(c.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);
      return expirationDate < today && c.completion < 100;
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
