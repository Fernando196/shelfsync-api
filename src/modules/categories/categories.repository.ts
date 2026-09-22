import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ICategoryRepository } from './interfaces/categories.repository';
import { applyFilters, FiltersInput } from '../common/query-filters';
import { Category } from './entities/category.entity';
import { CATEGORY_FILTEABLE_FILEDS } from './helpers/category_filtetable_fileds';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  findAll(filters: FiltersInput, page?: number, limit?: number): Promise<Category[]> {
    const qb = this.repo.createQueryBuilder('category').orderBy('category.createdAt', 'DESC');

    if (page && limit) {
      const offset: number = (page - 1) * limit;
      qb.skip(offset);
      qb.take(limit);
    }

    applyFilters(qb, 'category', filters, CATEGORY_FILTEABLE_FILEDS);

    return qb.getMany();
  }

  findByName(name: string): Promise<Category | null> {
    return this.repo.findOne({ where: { name } });
  }

  findById(id: string): Promise<Category | null> {
    return this.repo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        active: true,
        createdAt: true,
        createdBy: {
          id: true,
          fullName: true,
        },
        updatedAt: true,
        updatedBy: {
          id: true,
          fullName: true,
        },
      },
      relations: {
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  create(data: Partial<Category>): Promise<Category> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  update(data: Partial<Category>): Promise<Category> {
    return this.repo.save(data);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
