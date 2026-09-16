import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { ItemsRepository } from './items.repository';

@Injectable()
export class TypeOrmItemsRepository implements ItemsRepository {
  constructor(@InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>) {}

  findAll(query?: string, limit?: number, offset?: number): Promise<InventoryItem[]> {
    const qb = this.repo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.photos', 'photos')
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
    return this.repo.findOne({ where: { id }, relations: { photos: true } });
  }

  findBySku(sku: string): Promise<InventoryItem | null> {
    return this.repo.findOne({ where: { sku }, relations: { photos: true } });
  }

  save(item: InventoryItem): Promise<InventoryItem> {
    return this.repo.save(item);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
