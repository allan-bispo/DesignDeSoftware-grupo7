import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursosService {
  // Injeta o repositório da entidade 'Curso'
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  // CREATE
  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    // Se o status não for enviado, define 'BACKLOG' como padrão
    const cursoData = {
      ...createCursoDto,
      status: createCursoDto.status || 'BACKLOG',
    };

    const novoCurso = this.cursoRepository.create(cursoData);
    return await this.cursoRepository.save(novoCurso);
  }

  // READ (All)
  async findAll(): Promise<Curso[]> {
    return await this.cursoRepository.find();
  }
  async findOne(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findOneBy({ id });
    if (!curso) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado.`);
    }
    return curso;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto): Promise<Curso> {
    const cursoExistente = await this.cursoRepository.preload({
      id,
      ...updateCursoDto,
    });

    if (!cursoExistente) {
      throw new NotFoundException(`Curso com ID ${id} não encontrado.`);
    }

    return await this.cursoRepository.save(cursoExistente);
  }

  // DELETE
  async remove(id: number): Promise<Curso> {
    // 1. Tenta encontrar o curso. O findOne já trata o erro 404 se não existir.
    const curso = await this.findOne(id);

    // 2. Remove o curso (agora temos a certeza que 'curso' existe)
    await this.cursoRepository.remove(curso);

    // 3. Retorna o curso que foi removido (para cumprir o 'Promise<Curso>')
    //    Isto é útil para o frontend saber o que foi apagado.
    return curso;
  }
}
