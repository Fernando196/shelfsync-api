import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InventoryItem } from '../../items/entities/inventory-item.entity';

@Entity('product_lookup')
export class ProductLookup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150, nullable: true })
  barcode: string;

  @Column({ length: 150, nullable: true })
  sku: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
