import { InventoryItem } from '../entities/inventory-item.entity';
import { ItemStatus } from './ItemStatus.enum';

export const ITEMS_REPOSITORY = 'ITEMS_REPOSITORY';

export interface IItemsRepository {
  findAll(
    query?: string,
    limit?: number,
    offset?: number,
    statuses?: ItemStatus[],
  ): Promise<[InventoryItem[], number]>;
  countByStatus(query?: string): Promise<{ status: ItemStatus; count: number }[]>;
  findById(id: string): Promise<InventoryItem | null>;
  save(item: Partial<InventoryItem>): Promise<InventoryItem>;
  softDelete(id: string): Promise<void>;
}
