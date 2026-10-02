import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Check('CHK_product_lookup_code', '"barcode" IS NOT NULL OR "sku" IS NOT NULL')
@Entity('product_lookup')
export class ProductLookup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: true, unique: true })
  barcode: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true, unique: true })
  sku: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string | null;

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

  @Column({ type: 'boolean', default: false, name: 'need_assembly' })
  needAssembly: boolean;
}
