import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CATEGORY_REPOSITORY, ICategoryRepository } from './interfaces/categories.repository';
import { FiltersInput } from '../common/query-filters';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  findAll(query?: FiltersInput, page?: number, limit?: number) {
    return this.categoryRepository.findAll(query, page, limit);
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.categoryRepository.findByName(name);
    return category;
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException('The category does not exist');
    return category;
  }

  async remove(id: string) {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException('The category does not exist');
    }

    await this.categoryRepository.delete(id);
  }

  async update(
    id: string,
    categoryDto: UpdateCategoryDto,
    currentUser: User,
  ): Promise<Category | null> {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException('The category does not exist');
    }

    if (categoryDto?.name) {
      const exitName = await this.findByName(categoryDto.name);
      if (exitName) {
        throw new ConflictException('The category is already in use');
      }
      category.name = categoryDto.name;
    }
    if (Object.keys(categoryDto).includes('active')) {
      category.active = categoryDto.active ? true : false;
    }
    category.updatedBy = { id: currentUser.id } as User;
    await this.categoryRepository.update(category);
    return this.findById(category.id);
  }

  async create(data: CreateCategoryDto, currentUser: User): Promise<Category | null> {
    const existing = await this.findByName(data.name);

    if (existing) {
      throw new ConflictException('The category is already in use.');
    }

    const category: Partial<Category> = {
      id: data?.id ? data.id : randomUUID(),
      name: data.name,
      active: data.active ?? true,
      createdBy: { id: currentUser.id } as User,
    };
    const newCategory = await this.categoryRepository.create(category);

    return this.findById(newCategory.id);
  }
}
