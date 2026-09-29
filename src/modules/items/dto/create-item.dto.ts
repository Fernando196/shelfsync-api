import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ItemStatus } from '../interfaces/ItemStatus.enum';
import { CreateProductLookupDto } from '../../product-lookup/dto/create-product-lookup.dto';
import { Type } from 'class-transformer';

export class CreateItemDto {
  // Optional: present when the mobile app already generated a UUID for this
  // item (e.g. created while offline). Omitted, the server generates one.
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  qty?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  status?: ItemStatus;

  @IsOptional()
  @IsUUID()
  productLookupId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductLookupDto)
  productLookup?: CreateProductLookupDto;
}
