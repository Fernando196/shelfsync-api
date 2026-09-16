import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  create(data: Partial<User>): Promise<User> {
    return this.usersRepository.create(data);
  }
}
