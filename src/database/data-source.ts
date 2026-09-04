import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InventoryItem } from '../items/entities/inventory-item.entity';
import { ItemPhoto } from '../items/entities/item-photo.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, InventoryItem, ItemPhoto],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
