import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { EntityManager, Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { ItemFile } from './entities/item-file.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { User } from '../users/entities/user.entity';
import { IItemsRepository, ITEMS_REPOSITORY } from './interfaces/items.repository';
import { ItemStatus } from './interfaces/ItemStatus.enum';
import { ItemStatusHistory } from './entities/item-status-history';
import { Category } from '../categories/entities/category.entity';
import {
  IProductLookupRepository,
  PRODUCT_LOOKUP_REPOSITORY,
} from '../product-lookup/interfaces/product-lookup.repository';
import { DataSource } from 'typeorm';
import { ProductLookup } from '../product-lookup/entities/product-lookup.entity';
import { ALLOWED_FROM } from './const/allowed_from.const';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(ITEMS_REPOSITORY) private readonly itemsRepository: IItemsRepository,
    @InjectRepository(ItemFile) private readonly photosRepo: Repository<ItemFile>,
    @InjectRepository(ItemStatusHistory) private readonly statusRepo: Repository<ItemStatusHistory>,
    @Inject(PRODUCT_LOOKUP_REPOSITORY)
    private readonly productLookupRepo: IProductLookupRepository,
    private readonly dataSource: DataSource,
  ) {}

  findAll(query?: string, limit?: number, offset?: number): Promise<InventoryItem[]> {
    return this.itemsRepository.findAll(query, limit, offset);
  }

  async findById(id: string): Promise<InventoryItem> {
    const item = await this.itemsRepository.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async getStatusHistory(id: string): Promise<{ data: ItemStatusHistory[]; count: number }> {
    const item = await this.itemsRepository.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    const [data, count] = await this.statusRepo.findAndCount({
      where: { itemId: id },
      select: {
        id: true,
        itemId: true,
        fromStatus: true,
        toStatus: true,
        changedAt: true,
        comment: true,
        changedBy: {
          id: true,
          fullName: true,
        },
      },
      relations: { changedBy: true },
      order: { changedAt: 'DESC' },
    });
    return { data, count };
  }

  async upsert(dto: CreateItemDto, userId: string): Promise<InventoryItem> {
    const id = dto.id ?? randomUUID();
    const existing = await this.itemsRepository.findById(id);

    let productLookup: null | ProductLookup = null;
    if (!existing) {
      if (dto.productLookupId && dto.productLookup)
        throw new BadRequestException('No deben venir dos ProductLookUp');
      if (!dto.productLookupId && !dto.productLookup?.sku && !dto.productLookup?.barcode)
        throw new BadRequestException('No se encontro sku o productLookupId');
      if (dto?.productLookupId) {
        productLookup = await this.productLookupRepo.findById(dto.productLookupId);
        if (!productLookup) throw new NotFoundException('No existe el producto');
      } else if (dto?.productLookup) {
        if (dto.productLookup.barcode) {
          const barcodeSearch = await this.productLookupRepo.findByBarcode(
            dto.productLookup?.barcode,
          );
          if (barcodeSearch)
            throw new ConflictException('Ya existe un producto con el mismo barcode.');
        }
        if (dto.productLookup.sku) {
          const skuSearch = await this.productLookupRepo.findBySku(dto.productLookup.sku);
          if (skuSearch) throw new ConflictException('Ya existe un producto con el mismo sku.');
        }
      }
    }

    const itemId = await this.dataSource.transaction(async (manager) => {
      if (!existing && !productLookup?.id && dto.productLookup) {
        productLookup = await manager.save(ProductLookup, {
          barcode: dto.productLookup?.barcode ?? null,
          id: randomUUID(),
          sku: dto.productLookup.sku || null,
          createdBy: { id: userId } as User,
          description: dto.productLookup.description || null,
          needAssembly: dto.productLookup.needAssembly ?? false,
        });
      }

      const item = existing ?? new InventoryItem();

      if (!existing) {
        if (!productLookup?.id) throw new BadRequestException('El id del producto debe existir');
        item.productLookupId = productLookup.id;
      }

      item.id = id;
      if (dto.name !== undefined) item.name = dto.name;
      if (dto.qty !== undefined) item.qty = dto.qty;
      if (dto.location !== undefined) item.location = dto.location;
      if (dto.categoryId !== undefined) item.categoryId = dto.categoryId;
      if (dto.latitude !== undefined) item.latitude = dto.latitude;
      if (dto.longitude !== undefined) item.longitude = dto.longitude;
      if (dto.notes !== undefined) item.notes = dto.notes;
      if (!existing) {
        item.createdBy = { id: userId } as User;
      }

      await manager.save(InventoryItem, item);

      if (!existing) {
        await manager.save(ItemStatusHistory, {
          itemId: item.id,
          fromStatus: null,
          toStatus: ItemStatus.RECEIVED,
          changedBy: { id: userId } as User,
        });
        if (productLookup?.needAssembly) {
          await this.updateStatus(item.id, ItemStatus.PENDING_ASSEMBLY, userId, undefined, manager);
        }
      }

      return item.id;
    });

    return this.findById(itemId);
  }

  async update(id: string, dto: UpdateItemDto, userId: string): Promise<InventoryItem> {
    const item = await this.findById(id);
    Object.assign(item, dto);

    if (dto.categoryId !== undefined) {
      item.category = { id: dto.categoryId } as Category;
    }
    item.updatedBy = { id: userId } as User;
    await this.itemsRepository.save(item);
    return this.findById(item.id);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.itemsRepository.softDelete(id);
  }

  async addPhotos(id: string, files: Express.Multer.File[]) {
    const item = await this.findById(id);
    const photos = files.map((file) =>
      this.photosRepo.create({
        itemId: item.id,
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        kind: 'photo',
        mimeType: file.mimetype,
      }),
    );
    await this.photosRepo.save(photos);
    return this.findById(id);
  }

  async updateStatus(
    id: string,
    newStatus: ItemStatus,
    userId: string,
    comment?: string,
    manager?: EntityManager,
  ) {
    const em = manager ?? this.dataSource.manager;

    const item = await em.findOne(InventoryItem, { where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    if (!ALLOWED_FROM[newStatus].includes(item.status)) {
      throw new ConflictException(`No se puede pasar de ${item.status} a ${newStatus}`);
    }
    if (newStatus === ItemStatus.DAMAGED && !comment?.trim()) {
      throw new BadRequestException('Describe el daño');
    }

    const history = em.create(ItemStatusHistory, {
      itemId: id,
      fromStatus: item.status,
      toStatus: newStatus,
      changedBy: { id: userId } as User,
      comment,
    });
    await em.save(ItemStatusHistory, history);
    item.status = newStatus;
    return em.save(InventoryItem, item);
  }
}
