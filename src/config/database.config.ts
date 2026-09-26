import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { InventoryItem } from '../modules/items/entities/inventory-item.entity';
import { User } from '../modules/users/entities/user.entity';
import { ItemFile } from '../modules/items/entities/item-file.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { ProductLookup } from '../modules/product-lookup/entities/product-lookup.entity';
import { ItemStatusHistory } from '../modules/items/entities/item-status-history';

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, InventoryItem, ItemFile, Category, ProductLookup, ItemStatusHistory],
    synchronize: false,
  };
}
