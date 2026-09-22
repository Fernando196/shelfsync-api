import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FiltersInput } from '../common/query-filters';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  findAll(
    @Query('filters') filters: FiltersInput,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.categoryService.findAll(filters, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Get('name/:name')
  async findByEmial(@Param('email') name: string) {
    const category = await this.categoryService.findByName(name);
    if (!category) throw new NotFoundException('The category does not exist');
    return category;
  }

  @Post('')
  create(@Body() categoryDto: CreateCategoryDto, @CurrentUser() currentUser: User) {
    return this.categoryService.create(categoryDto, currentUser);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() categoryDto: UpdateCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.categoryService.update(id, categoryDto, currentUser);
  }

  @Patch(':id')
  patchUser(
    @Param('id') id: string,
    @Body() categoryDto: UpdateCategoryDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.categoryService.update(id, categoryDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
