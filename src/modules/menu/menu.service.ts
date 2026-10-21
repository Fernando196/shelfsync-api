import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Menu } from './entities/menu.entity';
import { MenuUser } from './entities/menu-user.entity';
import { UserMenuAccessDto } from './dto/update-user-menu.dto';
import { MENU_ADMIN_PATH } from './menu.constants';

export type UserMenuNode = Pick<Menu, 'id' | 'name' | 'path' | 'icon' | 'parentId' | 'order'> &
  Pick<MenuUser, 'canView' | 'canCreate' | 'canEdit' | 'canDelete'> & {
    children: UserMenuNode[];
  };

export type UserMenuAccess = Pick<
  MenuUser,
  'menuId' | 'canView' | 'canCreate' | 'canEdit' | 'canDelete'
>;

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    @InjectRepository(MenuUser) private readonly menuUserRepo: Repository<MenuUser>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Menu[]> {
    return this.menuRepo.find({ order: { order: 'ASC', name: 'ASC' } });
  }

  /** Menú visible del usuario como árbol; un hijo solo aparece si su padre también es visible. */
  async findForUser(userId: string): Promise<UserMenuNode[]> {
    const rows = await this.menuUserRepo.find({
      where: { userId, canView: true, menu: { active: true } },
      relations: { menu: true },
    });
    const nodes = new Map<string, UserMenuNode>();
    for (const { menu, canView, canCreate, canEdit, canDelete } of rows) {
      if (!menu) continue;
      const { id, name, path, icon, parentId, order } = menu;
      nodes.set(id, {
        id,
        name,
        path,
        icon,
        parentId,
        order,
        canView,
        canCreate,
        canEdit,
        canDelete,
        children: [],
      });
    }
    const roots: UserMenuNode[] = [];
    for (const node of nodes.values()) {
      if (!node.parentId) roots.push(node);
      else nodes.get(node.parentId)?.children.push(node);
    }
    const sort = (list: UserMenuNode[]): UserMenuNode[] => {
      list.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
      list.forEach((n) => sort(n.children));
      return list;
    };
    return sort(roots);
  }

  async getUserAccess(userId: string): Promise<UserMenuAccess[]> {
    await this.ensureUser(userId);
    const rows = await this.menuUserRepo.find({ where: { userId } });
    return rows.map(({ menuId, canView, canCreate, canEdit, canDelete }) => ({
      menuId,
      canView,
      canCreate,
      canEdit,
      canDelete,
    }));
  }

  /** Reemplaza todos los accesos del usuario por los recibidos. */
  async replaceUserAccess(userId: string, items: UserMenuAccessDto[]): Promise<UserMenuAccess[]> {
    await this.ensureUser(userId);
    const menuIds = items.map((i) => i.menuId);
    if (menuIds.length) {
      const found = await this.menuRepo.count({ where: { id: In(menuIds) } });
      if (found !== menuIds.length) throw new BadRequestException('Algún menuId no existe');
    }
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(MenuUser, { userId });
      if (items.length) {
        await manager.insert(
          MenuUser,
          items.map((i) => ({ ...i, userId })),
        );
      }
    });
    return this.getUserAccess(userId);
  }

  /** Por ahora sin restricciones: un usuario nuevo recibe acceso total a todos los menús. */
  async grantDefaults(userId: string): Promise<void> {
    const menus = await this.menuRepo.find();
    if (!menus.length) return;
    await this.menuUserRepo.upsert(
      menus.map((menu) => ({
        userId,
        menuId: menu.id,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      })),
      ['userId', 'menuId'],
    );
  }

  isMenuAdmin(userId: string): Promise<boolean> {
    return this.menuUserRepo.exists({
      where: { userId, canEdit: true, menu: { path: MENU_ADMIN_PATH } },
    });
  }

  private async ensureUser(userId: string) {
    const exists = await this.userRepo.exists({ where: { id: userId } });
    if (!exists) throw new NotFoundException('The user does not exist');
  }
}
