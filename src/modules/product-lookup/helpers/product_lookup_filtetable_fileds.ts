import { FilterableFieldsConfig } from '../../common/query-filters';

export const PRODUCT_LOOKUP_FILTEABLE_FILEDS: FilterableFieldsConfig = {
  id: ['eq', 'like'],
  description: ['eq', 'like'],
  barcode: ['eq', 'like'],
  sku: ['eq', 'like'],
  createdAt: ['eq', 'in', 'gte', 'lte'],
  updatedAt: ['eq', 'in', 'gte', 'lte'],
};
