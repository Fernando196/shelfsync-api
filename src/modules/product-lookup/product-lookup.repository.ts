import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { IProductLookupRepository } from './interfaces/product-lookup.repository';
import { applyFilters, FiltersInput } from '../common/query-filters';
import { ProductLookup } from './entities/product-lookup.entity';
import { PRODUCT_LOOKUP_FILTEABLE_FILEDS } from './helpers/product_lookup_filtetable_fileds';

@Injectable()
export class ProductLookupRepository implements IProductLookupRepository {
  constructor(@InjectRepository(ProductLookup) private readonly repo: Repository<ProductLookup>) {}

  findAll(filters: FiltersInput, page?: number, limit?: number): Promise<ProductLookup[]> {
    const qb = this.repo
      .createQueryBuilder('productLookup')
      .orderBy('productLookup.createdAt', 'DESC');

    if (page && limit) {
      const offset: number = (page - 1) * limit;
      qb.skip(offset);
      qb.take(limit);
    }

    applyFilters(qb, 'productLookup', filters, PRODUCT_LOOKUP_FILTEABLE_FILEDS);

    return qb.getMany();
  }

  findByBarcode(barcode: string): Promise<ProductLookup | null> {
    return this.repo.findOne({ where: { barcode } });
  }

  findBySku(sku: string): Promise<ProductLookup | null> {
    return this.repo.findOne({ where: { sku } });
  }

  findById(id: string): Promise<ProductLookup | null> {
    return this.repo.findOne({
      where: { id },
      select: {
        id: true,
        itemId: true,
        description: true,
        barcode: true,
        sku: true,
        item: {
          id: true,
          sku: true,
          name: true,
        },
        createdAt: true,
        createdBy: {
          id: true,
          fullName: true,
        },
        updatedAt: true,
        updatedBy: {
          id: true,
          fullName: true,
        },
      },
      relations: {
        item: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  create(data: Partial<ProductLookup>): Promise<ProductLookup> {
    const productLookup = this.repo.create(data);
    return this.repo.save(productLookup);
  }

  update(data: Partial<ProductLookup>): Promise<ProductLookup> {
    return this.repo.save(data);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.repo.delete(id);
  }
}
