import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { InventoryItem } from '../modules/items/entities/inventory-item.entity';
import { ItemFile } from '../modules/items/entities/item-file.entity';
import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { ProductLookup } from '../modules/product-lookup/entities/product-lookup.entity';
import { ItemStatusHistory } from '../modules/items/entities/item-status-history';
import { ItemStatus } from '../modules/items/interfaces/ItemStatus.enum';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, InventoryItem, ItemFile, Category, ProductLookup, ItemStatusHistory],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
