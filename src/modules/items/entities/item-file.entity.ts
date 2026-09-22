import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

@Entity('item_files')
export class ItemFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryItem, (item) => item.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: InventoryItem;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({ name: 'kind', length: '150' })
  kind: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column()
  filename: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column()
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
