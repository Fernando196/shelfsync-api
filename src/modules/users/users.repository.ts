import { User } from './entities/user.entity';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
}
