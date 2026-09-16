import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ default: true })
  active: boolean

  @ManyToOne(()=> User,{ nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name:'created_by' })
  createdBy: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(()=> User,{ nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name:'updated_by' })
  updateBy: User

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}
