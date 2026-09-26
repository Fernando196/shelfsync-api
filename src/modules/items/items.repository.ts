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
      .orderBy('item.createdAt', 'DESC');

    if (query) {
      qb.andWhere('(item.sku ILIKE :q OR item.name ILIKE :q OR item.location ILIKE :q)', {
        q: `%${query}%`,
      });
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
        categoryId: true,
        sku: true,
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
      },
      relations: { files: true, createdBy: true, updatedBy: true, category: true },
    });
  }

  findBySku(sku: string): Promise<InventoryItem | null> {
    return this.repo.findOne({ where: { sku }, relations: { files: true } });
  }

  save(item: InventoryItem): Promise<InventoryItem> {
    return this.repo.save(item);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
