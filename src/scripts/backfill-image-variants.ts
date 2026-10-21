/**
 * Genera la variante medium (y el thumbnail si falta) para fotos existentes.
 *
 * Correr donde vive la carpeta uploads real (dentro del contenedor):
 *   docker exec shelfsync-api node dist/scripts/backfill-image-variants.js           # dry-run
 *   docker exec shelfsync-api node dist/scripts/backfill-image-variants.js --apply   # aplica cambios
 */
import { access } from 'fs/promises';
import { basename } from 'path';
import { IsNull } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { ItemFile } from '../modules/items/entities/item-file.entity';
import { generateVariant, UPLOADS_DIR } from '../modules/items/image-variants';

async function main() {
  const apply = process.argv.includes('--apply');
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(ItemFile);
  const pending = await repo.find({ where: { mediumUrl: IsNull() } });

  let updated = 0;
  const missing: string[] = [];
  const failed: string[] = [];

  for (const file of pending) {
    try {
      await access(`${UPLOADS_DIR}/${basename(file.filename)}`);
    } catch {
      missing.push(file.filename);
      continue;
    }
    if (!apply) continue;

    const changes: Partial<ItemFile> = {};
    const mediumUrl = await generateVariant(file.filename, 'medium');
    if (mediumUrl) changes.mediumUrl = mediumUrl;
    if (!file.thumbnailUrl) {
      const thumbnailUrl = await generateVariant(file.filename, 'thumbs');
      if (thumbnailUrl) changes.thumbnailUrl = thumbnailUrl;
    }
    if (!mediumUrl) failed.push(file.filename);
    if (Object.keys(changes).length) {
      await repo.update(file.id, changes);
      updated++;
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        pending: pending.length,
        processable: pending.length - missing.length,
        updated,
        missingOriginals: missing,
        failed,
      },
      null,
      2,
    ),
  );
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
