import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from './users.repository';
import { TypeOrmUsersRepository } from './typeorm-users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, { provide: USERS_REPOSITORY, useClass: TypeOrmUsersRepository }],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
