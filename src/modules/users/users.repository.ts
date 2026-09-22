import { DeleteResult } from 'typeorm';
import { FiltersInput } from '../common/query-filters';
import { User } from './entities/user.entity';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findAll(filters?: FiltersInput, page?: number, limit?: number): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(data: Partial<User>): Promise<User>;
  delete(id: string): Promise<DeleteResult>;
}
