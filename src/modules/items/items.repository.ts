import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { IItemsRepository } from './interfaces/items.repository';
import { ItemStatusHistory } from './entities/item-status-history';

@Injectable()
export class ItemsRepository implements IItemsRepository {
  constructor(@InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>) {}

  findAll(query?: string, limit?: number, offset?: number): Promise<InventoryItem[]> {
    const qb = this.repo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.files', 'files')
      .leftJoinAndSelect('item.productLookup', 'productLookup')
      .orderBy('item.createdAt', 'DESC');

    if (query) {
      qb.andWhere(
        '(item.name ILIKE :q OR item.location ILIKE :q OR productLookup.sku ILIKE :q OR productLookup.barcode ILIKE :q OR CAST(item.code AS TEXT) ILIKE :q)',
        {
          q: `%${query}%`,
        },
      );
    }
    if (limit) qb.take(limit);
    if (offset) qb.skip(offset);

    return qb.getMany();
  }

  findById(id: string): Promise<InventoryItem | null> {
    return this.repo.findOne({
      where: { id },
      select: {
        id: true,
        code: true,
        categoryId: true,
        name: true,
        qty: true,
        location: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        files: true,
        createdBy: {
          fullName: true,
        },
        updatedBy: {
          fullName: true,
        },
        category: {
          id: true,
          name: true,
        },
        productLookup: {
          id: true,
          barcode: true,
          sku: true,
          description: true,
        },
      },
      relations: {
        files: true,
        createdBy: true,
        updatedBy: true,
        category: true,
        productLookup: true,
      },
    });
  }

  save(item: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.repo.save(item);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
