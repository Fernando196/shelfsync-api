import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

@Entity('item_photos')
export class ItemPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryItem, (item) => item.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: InventoryItem;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({ name: 'kind', length:'150' })
  kind: string;

  @Column({ name: 'mime_type', length:100 })
  mimeType: string;

  @Column()
  filename: string;

  @Column()
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
