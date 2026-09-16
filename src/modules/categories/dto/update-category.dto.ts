import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';
import { CreateCategory } from './create-category.dto';

export class UpdateCategory extends PartialType(CreateCategory){
  @IsUUID()
  @IsString()
  id: string;
};