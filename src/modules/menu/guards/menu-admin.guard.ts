import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { MenuService } from '../menu.service';

@Injectable()
export class MenuAdminGuard implements CanActivate {
  constructor(private readonly menuService: MenuService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    if (!user?.id || !(await this.menuService.isMenuAdmin(user.id))) {
      throw new ForbiddenException('No tienes permiso para administrar menús');
    }
    return true;
  }
}
