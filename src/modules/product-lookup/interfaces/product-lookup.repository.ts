import { DeleteResult } from 'typeorm';
import { FiltersInput } from '../../common/query-filters';
import { ProductLookup } from '../entities/product-lookup.entity';

export const PRODUCT_LOOKUP_REPOSITORY = 'PRODUCT_LOOKUP_REPOSITORY';

export interface IProductLookupRepository {
  findAll(filters?: FiltersInput, page?: number, limit?: number): Promise<ProductLookup[]>;
  findById(id: string): Promise<ProductLookup | null>;
  findByBarcode(barcode: string): Promise<ProductLookup | null>;
  findBySku(sku: string): Promise<ProductLookup | null>;
  create(data: Partial<ProductLookup>): Promise<ProductLookup>;
  update(data: Partial<ProductLookup>): Promise<ProductLookup>;
  delete(id: string): Promise<DeleteResult>;
}
