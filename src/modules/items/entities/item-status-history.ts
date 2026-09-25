import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { User } from '../../users/entities/user.entity';
import { ItemStatus } from '../interfaces/ItemStatus.enum';

@Entity('item_status_history')
export class ItemStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryItem, (item) => item.statusHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: InventoryItem;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({ type: 'enum', enum: ItemStatus, name: 'from_status', nullable: true })
  fromStatus: ItemStatus | null;

  @Column({ type: 'enum', enum: ItemStatus, name: 'to_status' })
  toStatus: ItemStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
