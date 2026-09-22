import { SelectQueryBuilder } from "typeorm";

export type FilterOperator = 'eq' | 'like' | 'gte' | 'lte' | 'in';
export type FilterableFieldsConfig = Record<string, FilterOperator[]>;
export type FiltersInput = Record<string, Record<string, string>>;

export function applyFilters<T extends object>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  filters: FiltersInput = {},
  allowed: FilterableFieldsConfig,
): void {
  for (const [field, ops] of Object.entries(filters)) {
    const allowedOps = allowed[field];
    if (!allowedOps || typeof ops !== 'object') continue;

    for (const [operator, value] of Object.entries(ops)) {
      if (!allowedOps.includes(operator as FilterOperator) || !value) continue;

      const param = `${alias}_${field}_${operator}`;
      if (operator === 'eq') qb.andWhere(`${alias}.${field} = :${param}`, { [param]: value });
      if (operator === 'like') qb.andWhere(`${alias}.${field} ILIKE :${param}`, { [param]: `%${value}%` });
      if (operator === 'gte') qb.andWhere(`${alias}.${field} >= :${param}`, { [param]: value });
      if (operator === 'lte') qb.andWhere(`${alias}.${field} <= :${param}`, { [param]: value });
      if (operator === 'in') qb.andWhere(`${alias}.${field} in :${param}`, { [param] : value });
    }
  }
}