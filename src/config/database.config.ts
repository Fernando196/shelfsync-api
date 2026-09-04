import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { InventoryItem } from '../items/entities/inventory-item.entity';
import { ItemPhoto } from '../items/entities/item-photo.entity';

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, InventoryItem, ItemPhoto],
    // Schema changes go through migrations (src/database/migrations), never
    // through synchronize — this connects to a shared server, not a
    // throwaway local db.
    synchronize: false,
  };
}
