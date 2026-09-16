import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepo.find({ where: { active: true }, order: { name: 'asc'}  })
  }

  create(dto: CreateCategoryDto, userId: string){
    const category = new Category();

    category.name = dto.name;
    if(dto.active !== undefined ) category.active = dto.active;
    category.createdBy = { id: userId } as User;

    return this.categoryRepo.save(category);
  }
  async update(id: string, dto: UpdateCategoryDto, userId: string){
    const category = await this.categoryRepo.findOneBy({ id });
    if(!category){
        throw new NotFoundException();
    }
    Object.assign(category,dto);
    category.updatedBy = { id: userId }  as User;
    return this.categoryRepo.save(category);
  }
}
