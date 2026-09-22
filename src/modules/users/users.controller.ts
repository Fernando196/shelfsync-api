import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { FiltersInput } from '../common/query-filters';
import { Public } from '../common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly userService: UsersService){}

  @Get('')
  findAll(@Query('filters') filters: FiltersInput, @Query('page') page?: number, @Query('limit') limit?: number){
    return this.userService.findAll(filters,page, limit)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  findByEmial(@Param('email') email: string){
    return this.userService.findByEmail(email);
  }

  @Post('')
  create(@Body() userDto: CreateUserDto, @CurrentUser() currentUser: User){
    return this.userService.create(userDto, currentUser)
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userDto: UpdateUserDto, @CurrentUser() currentUser: User){
    return this.userService.update(id, userDto, currentUser);
  }

  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() userDto: UpdateUserDto, @CurrentUser() currentUser: User){
    return this.userService.update(id, userDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string){
    return this.userService.remove(id);
  }
}
