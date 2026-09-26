import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { ItemFile } from './entities/item-file.entity';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ITEMS_REPOSITORY } from './interfaces/items.repository';
import { ItemsRepository } from './items.repository';
import { ItemStatusHistory } from './entities/item-status-history';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, ItemFile, ItemStatusHistory])],
  providers: [ItemsService, { provide: ITEMS_REPOSITORY, useClass: ItemsRepository }],
  controllers: [ItemsController],
})
export class ItemsModule {}
