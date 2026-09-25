import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { ItemFile } from './entities/item-file.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { User } from '../users/entities/user.entity';
import { IItemsRepository, ITEMS_REPOSITORY } from './interfaces/items.repository';
import { ItemStatus } from './interfaces/ItemStatus.enum';
import { ItemStatusHistory } from './entities/item-status-history';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(ITEMS_REPOSITORY) private readonly itemsRepository: IItemsRepository,
    @InjectRepository(ItemFile) private readonly photosRepo: Repository<ItemFile>,
    @InjectRepository(ItemStatusHistory) private readonly statusRepo: Repository<ItemStatusHistory>,
  ) {}

  findAll(query?: string, limit?: number, offset?: number): Promise<InventoryItem[]> {
    return this.itemsRepository.findAll(query, limit, offset);
  }

  async findById(id: string): Promise<InventoryItem> {
    const item = await this.itemsRepository.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async findBySku(sku: string): Promise<InventoryItem> {
    const item = await this.itemsRepository.findBySku(sku);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async upsert(dto: CreateItemDto, userId: string): Promise<InventoryItem> {
    const id = dto.id ?? randomUUID();
    const existing = await this.itemsRepository.findById(id);

    if (!existing) {
      const bySku = await this.itemsRepository.findBySku(dto.sku);
      if (bySku) throw new ConflictException(`SKU "${dto.sku}" already exists`);
    }

    const item = existing ?? new InventoryItem();
    item.id = id;
    item.sku = dto.sku;
    if (dto.name !== undefined) item.name = dto.name;
    if (dto.qty !== undefined) item.qty = dto.qty;
    if (dto.location !== undefined) item.location = dto.location;
    if (dto.categoryId !== undefined) item.categoryId = dto.categoryId;
    if (dto.latitude !== undefined) item.latitude = dto.latitude;
    if (dto.longitude !== undefined) item.longitude = dto.longitude;
    if (!existing) item.createdBy = { id: userId } as User;

    await this.itemsRepository.save(item);
    this.updateStatus(item.id, dto?.status ?? ItemStatus.RECEIVED, userId);
    return this.findById(item.id);
  }

  async update(id: string, dto: UpdateItemDto, userId: string): Promise<InventoryItem> {
    const item = await this.findById(id);
    Object.assign(item, dto);
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
    const addedPhotos = await this.photosRepo.save(photos);
    return { item: await this.findById(id), addedPhotos };
  }

  async updateStatus(id: string, changeDate: Date, newStatus: ItemStatus, userId: string) {
    const item = await this.itemsRepository.findById(id);
    if (!item) throw new NotFoundException('Item not found');

    const history = new ItemStatusHistory();
    history.itemId = id;
    history.fromStatus = item.status;
    history.toStatus = newStatus;
    history.changedAt = changeDate;
    history.changedBy = { id: userId } as User;
    await this.statusRepo.save(history);

    item.status = newStatus;
    return this.itemsRepository.save(item);
  }
}
