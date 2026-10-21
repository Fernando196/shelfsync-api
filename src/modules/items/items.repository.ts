import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { IItemsRepository } from './interfaces/items.repository';
import { ItemStatusHistory } from './entities/item-status-history';
import { ItemStatus } from './interfaces/ItemStatus.enum';

@Injectable()
export class ItemsRepository implements IItemsRepository {
  constructor(@InjectRepository(InventoryItem) private readonly repo: Repository<InventoryItem>) {}

  findAll(
    query?: string,
    limit?: number,
    offset?: number,
    statuses?: ItemStatus[],
  ): Promise<[InventoryItem[], number]> {
    const qb = this.repo
      .createQueryBuilder('item')
      .leftJoinAndMapOne(
        'item.cover',
        'item.files',
        'cover',
        `cover.id = coalesce(
          (select f.id from item_files f where f.id = item.cover_photo_id and f.item_id = item.id),
          (select f.id from item_files f where f.item_id = item.id order by f.created_at desc, f.id desc limit 1)
        )`,
      )
      .leftJoinAndSelect('item.productLookup', 'productLookup')
      .orderBy('item.createdAt', 'DESC')
      .addOrderBy('item.id', 'DESC');

    this.applySearch(qb, query);
    if (statuses?.length) qb.andWhere('item.status IN (:...statuses)', { statuses });
    if (limit) qb.take(limit);
    if (offset) qb.skip(offset);

    return qb.getManyAndCount();
  }

  async countByStatus(query?: string): Promise<{ status: ItemStatus; count: number }[]> {
    const qb = this.repo
      .createQueryBuilder('item')
      .leftJoin('item.productLookup', 'productLookup')
      .select('item.status', 'status')
      .addSelect('COUNT(*)::int', 'count')
      .groupBy('item.status');
    this.applySearch(qb, query);
    return qb.getRawMany();
  }

  private applySearch(qb: SelectQueryBuilder<InventoryItem>, query?: string) {
    if (query) {
      qb.andWhere(
        '(item.name ILIKE :q OR item.location ILIKE :q OR productLookup.sku ILIKE :q OR productLookup.barcode ILIKE :q OR CAST(item.code AS TEXT) ILIKE :q)',
        {
          q: `%${query}%`,
        },
      );
    }
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const item = await this.repo.findOne({
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
        coverPhotoId: true,
        status: true,
        price: true,
        cost: true,
        condition: true,
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

    if (!item) return null;

    const files = item.files ?? [];
    const [newest] = [...files].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id),
    );
    item.cover = files.find((f) => f.id === item.coverPhotoId) ?? newest ?? null;

    return item;
  }

  save(item: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.repo.save(item);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
