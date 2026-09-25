import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductLookupDto } from './create-product-lookup.dto';

export class UpdateProductLookupDto extends PartialType(
  OmitType(CreateProductLookupDto, ['id'] as const),
) {}
