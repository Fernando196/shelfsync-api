import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ItemFile } from './item-file.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductLookup } from '../../product-lookup/entities/product-lookup.entity';
import { ItemStatus } from '../interfaces/ItemStatus.enum';
import { ItemStatusHistory } from './item-status-history';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true, name: 'category_id' })
  categoryId: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'integer', default: 0 })
  qty: number;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ItemFile, (photo) => photo.item)
  files: ItemFile[];

  @Column({ nullable: true, name: 'product_lookup_id' })
  productLookupId: string;

  @ManyToOne(() => ProductLookup, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_lookup_id' })
  productLookup: ProductLookup;

  @Column({ name: 'status', type: 'enum', enum: ItemStatus, default: ItemStatus.RECEIVED })
  status: ItemStatus;

  @OneToMany(() => ItemStatusHistory, (h) => h.item)
  statusHistory: ItemStatusHistory[];
}
