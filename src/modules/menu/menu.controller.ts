import { Body, Controller, Get, Param, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { MenuService } from './menu.service';
import { MenuAdminGuard } from './guards/menu-admin.guard';
import { UpdateUserMenuDto } from './dto/update-user-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('me')
  findMine(@CurrentUser() user: User) {
    return this.menuService.findForUser(user.id);
  }

  @Get()
  @UseGuards(MenuAdminGuard)
  findAll() {
    return this.menuService.findAll();
  }
}

@Controller('users/:id/menu')
@UseGuards(MenuAdminGuard)
export class UserMenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  find(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuService.getUserAccess(id);
  }

  @Put()
  replace(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserMenuDto) {
    return this.menuService.replaceUserAccess(id, dto.items);
  }
}
