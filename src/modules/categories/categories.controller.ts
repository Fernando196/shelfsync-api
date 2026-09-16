import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoryService: CategoryService){}

  @Get()
  findAll(){
    return this.categoryService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCategoryDto, @CurrentUser() user: User){
    return this.categoryService.create(dto, user.id)
  }

  @Patch(':id')
  update(@Param('id') id:string, @Body() dto: UpdateCategoryDto, @CurrentUser() user: User){
    return this.categoryService.update(id, dto,user.id)
  }
}
