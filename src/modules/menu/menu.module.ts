import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Menu } from './entities/menu.entity';
import { MenuUser } from './entities/menu-user.entity';
import { MenuService } from './menu.service';
import { MenuController, UserMenuController } from './menu.controller';
import { MenuAdminGuard } from './guards/menu-admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuUser, User])],
  providers: [MenuService, MenuAdminGuard],
  controllers: [MenuController, UserMenuController],
  exports: [MenuService],
})
export class MenuModule {}
