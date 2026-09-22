import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { FiltersInput } from '../common/query-filters';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto';
import { NOTFOUND } from 'node:dns';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository) {}

  findAll(query?: FiltersInput, page?: number, limit?: number){
    return this.usersRepository.findAll(query, page, limit);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.usersRepository.findByEmail(email);
    if(!user) throw new NotFoundException('The user does not exist');
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findById(id);
    if(!user) throw new NotFoundException('The user does not exist');
    return user;
  }

  async remove(id: string){
    const user = await this.findById(id);
    if(!user){
      throw new NotFoundException('The user does not exist');
    }

    await this.usersRepository.delete(id);
  }

  async update(id: string, userDto: UpdateUserDto , currentUser: User): Promise<User>{
    const user = await this.findById(id);
    if(!user){
      throw new NotFoundException('The user does not exist');
    }

    if(userDto?.email){
      const existEmail = await this.findByEmail(userDto.email);
      if(existEmail){
        throw new ConflictException('The email is already in use');
      }
      user.email = userDto.email;
    }
    if(userDto?.fullName) user.fullName = userDto.fullName;
    if(userDto?.password){
      const newPasswordHash = bcrypt.hashSync(userDto.password,10);
      user.passwordHash = newPasswordHash;
    }

    user.updatedBy = { id: currentUser.id } as User
    await this.usersRepository.update(user);
    return user;
  }

  async create(data: CreateUserDto, currentUser: User): Promise<User> {
    const existing = await this.findByEmail(data.email);

    if(existing){
      throw new ConflictException('The email is already in use.');
    }

    const passwordHash = bcrypt.hashSync(data.password,10);

    const user: Partial<User> = {
      id: data?.id ? data.id : randomUUID(),
      email: data.email,
      passwordHash,
      createdBy: { id: currentUser.id } as User
    }
    return await this.usersRepository.create(user);
  }
}
