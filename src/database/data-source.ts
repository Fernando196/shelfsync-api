import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { InventoryItem } from '../modules/items/entities/inventory-item.entity';
import { ItemPhoto } from '../modules/items/entities/item-photo.entity';
import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, InventoryItem, ItemPhoto, Category],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
