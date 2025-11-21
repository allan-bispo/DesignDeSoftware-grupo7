import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryItem } from './entities/library-item.entity';
import { LibraryFiltersDto } from './dto/library-filters.dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(LibraryItem)
    private readonly libraryRepository: Repository<LibraryItem>,
  ) {}

  async findAll(filters: LibraryFiltersDto) {
    const { search, category, tags, page = 1, limit = 10 } = filters;

    const queryBuilder = this.libraryRepository.createQueryBuilder('item');

    if (search) {
      queryBuilder.where(
        '(item.title LIKE :search OR item.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('item.category = :category', { category });
    }

    if (tags && tags.length > 0) {
      // Lógica AND para tags - cada tag deve estar presente
      tags.forEach((tag, index) => {
        queryBuilder.andWhere(`item.tags LIKE :tag${index}`, {
          [`tag${index}`]: `%${tag}%`,
        });
      });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    queryBuilder.orderBy('item.addedAt', 'DESC');

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
}
