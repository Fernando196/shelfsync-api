import { DeleteResult } from 'typeorm';
import { FiltersInput } from '../../common/query-filters';
import { Category } from '../entities/category.entity';

export const CATEGORY_REPOSITORY = ' CATEGORY_REPOSITORY';

export interface ICategoryRepository {
  findAll(filters?: FiltersInput, page?: number, limit?: number): Promise<Category[]>;
  findByName(name: string): Promise<Category | null>;
  findById(id: string): Promise<Category | null>;
  create(data: Partial<Category>): Promise<Category>;
  update(data: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<DeleteResult>;
}
