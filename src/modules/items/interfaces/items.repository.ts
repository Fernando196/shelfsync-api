import { InventoryItem } from '../entities/inventory-item.entity';

export const ITEMS_REPOSITORY = 'ITEMS_REPOSITORY';

export interface IItemsRepository {
  findAll(query?: string, limit?: number, offset?: number): Promise<InventoryItem[]>;
  findById(id: string): Promise<InventoryItem | null>;
  findBySku(sku: string): Promise<InventoryItem | null>;
  save(item: InventoryItem): Promise<InventoryItem>;
  softDelete(id: string): Promise<void>;
}
