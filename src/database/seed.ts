import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { User } from '../modules/users/entities/user.entity';
import { Menu } from '../modules/menu/entities/menu.entity';
import { MenuUser } from '../modules/menu/entities/menu-user.entity';

function randomPassword(): string {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const userName = process.env.SEED_USER_NAME || 'admin';
  let user = await repo.findOne({ where: { userName } });
  if (user) {
    console.log(`User ${userName} already exists.`);
  } else {
    const password = process.env.SEED_ADMIN_PASSWORD || randomPassword();
    const passwordHash = await bcrypt.hash(password, 10);
    user = await repo.save(repo.create({ userName, passwordHash, fullName: 'Admin' }));

    console.log('Seed user created:');
    console.log(`  userName:    ${userName}`);
    console.log(`  password: ${password}`);
  }

  // El admin recibe todos los permisos en todos los menús (idempotente).
  const menus = await AppDataSource.getRepository(Menu).find();
  if (menus.length) {
    await AppDataSource.getRepository(MenuUser).upsert(
      menus.map((menu) => ({
        userId: user.id,
        menuId: menu.id,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      })),
      ['userId', 'menuId'],
    );
    console.log(`Granted ${menus.length} menus to ${userName}.`);
  }

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
