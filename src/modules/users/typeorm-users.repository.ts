import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { applyFilters, FiltersInput } from '../common/query-filters';
import { USERS_FILTEABLE_FILEDS } from './helpers/users_filtetable_fileds';

@Injectable()
export class TypeOrmUsersRepository implements UsersRepository {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findByEmailAuth(email: string): Promise<User | null> {
    return this.repo.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email',{email})
      .getOne()
  }

  findAll(filters: FiltersInput, page?: number, limit?: number): Promise<User[]> {
    const qb = this.repo
      .createQueryBuilder('user')
      .orderBy('user.createdAt','DESC')

    if(page && limit){
      const offset: number = ( page - 1 ) * limit;
      qb.skip(offset);
      qb.take(limit);
    }

    applyFilters(qb,'users',filters,USERS_FILTEABLE_FILEDS);

    return qb.getMany();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id }, select:{ id: true, email: true, createdAt: true, fullName: true, updatedAt: true, updatedBy: true, createdBy: true } });
  }

  create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  update(data: Partial<User>): Promise<User>{
    return this.repo.save(data);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
