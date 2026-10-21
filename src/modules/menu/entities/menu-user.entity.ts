import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Menu } from './menu.entity';

@Entity('menu_users')
@Unique('UQ_menu_users_user_menu', ['userId', 'menuId'])
export class MenuUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'menu_id', type: 'uuid' })
  menuId: string;

  @ManyToOne(() => Menu, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu?: Menu;

  @Column({ name: 'can_view', default: false })
  canView: boolean;

  @Column({ name: 'can_create', default: false })
  canCreate: boolean;

  @Column({ name: 'can_edit', default: false })
  canEdit: boolean;

  @Column({ name: 'can_delete', default: false })
  canDelete: boolean;
}
