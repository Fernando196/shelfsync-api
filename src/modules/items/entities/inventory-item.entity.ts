import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ItemPhoto } from './item-photo.entity';

@Entity('inventory_items')
export class InventoryItem {
  // Not auto-generated: the mobile app creates this UUID client-side so an
  // item made while offline keeps a stable identity once it syncs later.
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'integer', default: 0 })
  qty: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @Column({ name: 'created_by_user_id', nullable: true })
  createdByUserId: string | null;

  @OneToMany(() => ItemPhoto, (photo) => photo.item)
  photos: ItemPhoto[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
