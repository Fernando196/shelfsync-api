import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../users/entities/user.entity';
import { ProductLookup } from './entities/product-lookup.entity';
import { CreateProductLookupDto } from './dto/create-product-lookup.dto';
import { UpdateProductLookupDto } from './dto/update-product-lookup.dto';
import {
  IProductLookupRepository,
  PRODUCT_LOOKUP_REPOSITORY,
} from './interfaces/product-lookup.repository';
import { FiltersInput } from '../common/query-filters';

@Injectable()
export class ProductLookupService {
  constructor(
    @Inject(PRODUCT_LOOKUP_REPOSITORY)
    private readonly productLookupRepository: IProductLookupRepository,
  ) {}

  findAll(query?: FiltersInput, page?: number, limit?: number) {
    return this.productLookupRepository.findAll(query, page, limit);
  }

  findByBarcode(barcode: string): Promise<ProductLookup | null> {
    return this.productLookupRepository.findByBarcode(barcode);
  }

  findBySku(sku: string): Promise<ProductLookup | null> {
    return this.productLookupRepository.findBySku(sku);
  }

  async findById(id: string): Promise<ProductLookup> {
    const productLookup = await this.productLookupRepository.findById(id);
    if (!productLookup) throw new NotFoundException('The product lookup does not exist');
    return productLookup;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.productLookupRepository.delete(id);
  }

  async update(id: string, dto: UpdateProductLookupDto, currentUser: User): Promise<ProductLookup> {
    const productLookup = await this.findById(id);

    if (dto?.barcode && dto.barcode !== productLookup.barcode) {
      const existBarcode = await this.findByBarcode(dto.barcode);
      if (existBarcode) throw new ConflictException('The barcode is already in use');
    }
    if (dto?.sku && dto.sku !== productLookup.sku) {
      const existSku = await this.findBySku(dto.sku);
      if (existSku) throw new ConflictException('The sku is already in use');
    }

    // Save only the columns, not the loaded relation, so a new itemId is persisted
    const { item, ...data } = productLookup;
    if (dto.itemId !== undefined) data.itemId = dto.itemId;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.barcode !== undefined) data.barcode = dto.barcode;
    if (dto.sku !== undefined) data.sku = dto.sku;
    data.updatedBy = { id: currentUser.id } as User;

    await this.productLookupRepository.update(data);
    return this.findById(id);
  }

  async create(data: CreateProductLookupDto, currentUser: User): Promise<ProductLookup> {
    if (data.barcode) {
      const existBarcode = await this.findByBarcode(data.barcode);
      if (existBarcode) throw new ConflictException('The barcode is already in use.');
    }
    if (data.sku) {
      const existSku = await this.findBySku(data.sku);
      if (existSku) throw new ConflictException('The sku is already in use.');
    }

    const productLookup: Partial<ProductLookup> = {
      id: data?.id ? data.id : randomUUID(),
      itemId: data.itemId,
      description: data.description,
      barcode: data.barcode,
      sku: data.sku,
      createdBy: { id: currentUser.id } as User,
    };
    const newProductLookup = await this.productLookupRepository.create(productLookup);

    return this.findById(newProductLookup.id);
  }
}
