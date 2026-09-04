import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { ItemPhoto } from './entities/item-photo.entity';
import { ITEMS_REPOSITORY } from './items.repository';
import { TypeOrmItemsRepository } from './typeorm-items.repository';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, ItemPhoto])],
  providers: [ItemsService, { provide: ITEMS_REPOSITORY, useClass: TypeOrmItemsRepository }],
  controllers: [ItemsController],
})
export class ItemsModule {}
