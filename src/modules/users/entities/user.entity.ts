import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @ManyToOne(()=> User,{ nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name:'created_by' })
  createdBy: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(()=> User,{ nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name:'updated_by' })
  updatedBy: User

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
