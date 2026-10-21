import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ItemStatus } from '../interfaces/ItemStatus.enum';
import { ItemCondition } from '../interfaces/ItemCondition.enum';
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
  @IsUUID()
  productLookupId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductLookupDto)
  productLookup?: CreateProductLookupDto;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  notes?: string;

  // null borra el precio
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(99999999.99)
  price?: number | null;

  // costo de compra; null lo borra
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(99999999.99)
  cost?: number | null;

  @IsOptional()
  @IsEnum(ItemCondition)
  condition?: ItemCondition;
}
