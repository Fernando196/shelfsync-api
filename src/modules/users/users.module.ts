import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from './interfaces/users.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, { provide: USERS_REPOSITORY, useClass: UsersRepository }],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
