import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CATEGORY_REPOSITORY } from './interfaces/categories.repository';
import { CategoryRepository } from './categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository
    }
  ],
  controllers: [CategoriesController],
})
export class CategoryModule {}
