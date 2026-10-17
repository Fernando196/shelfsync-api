import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { User } from '../modules/users/entities/user.entity';

function randomPassword(): string {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const userName = process.env.SEED_USER_NAME || 'admin';
  const existing = await repo.findOne({ where: { userName } });
  if (existing) {
    console.log(`User ${userName} already exists, nothing to do.`);
    await AppDataSource.destroy();
    return;
  }

  const password = process.env.SEED_ADMIN_PASSWORD || randomPassword();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = repo.create({ userName, passwordHash, fullName: 'Admin' });
  await repo.save(user);

  console.log('Seed user created:');
  console.log(`  userName:    ${userName}`);
  console.log(`  password: ${password}`);

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
