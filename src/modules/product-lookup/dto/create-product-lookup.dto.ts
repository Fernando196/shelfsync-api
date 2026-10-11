import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProductLookupDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value))
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  barcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  sku?: string;

  @IsOptional()
  @IsBoolean()
  needAssembly?: boolean;
}
