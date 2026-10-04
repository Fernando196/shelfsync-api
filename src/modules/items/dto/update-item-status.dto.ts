import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ItemStatus } from '../interfaces/ItemStatus.enum';

export class UpdateItemStatusDto {
  @IsEnum(ItemStatus)
  status: ItemStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  comment?: string;
}
