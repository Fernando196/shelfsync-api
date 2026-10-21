import { mkdir, unlink } from 'fs/promises';
import { basename, extname } from 'path';
import sharp from 'sharp';

export const UPLOADS_DIR = './uploads';

const VARIANTS = {
  thumbs: { size: 240, quality: 70 },
  medium: { size: 800, quality: 80 },
} as const;

type Variant = keyof typeof VARIANTS;

const variantName = (filename: string) => `${basename(filename, extname(filename))}.webp`;

/** Genera una variante WebP (lado mayor = size, sin agrandar). Regresa su URL o null si falla. */
export async function generateVariant(filename: string, variant: Variant): Promise<string | null> {
  const { size, quality } = VARIANTS[variant];
  const name = variantName(filename);
  try {
    await mkdir(`${UPLOADS_DIR}/${variant}`, { recursive: true });
    await sharp(`${UPLOADS_DIR}/${basename(filename)}`)
      .rotate()
      .resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(`${UPLOADS_DIR}/${variant}/${name}`);
    return `/uploads/${variant}/${name}`;
  } catch (err) {
    console.log(`Error al generar la variante ${variant} para el archivo: `, filename, err);
    return null;
  }
}

/** Borra el original y todas sus variantes (incluye thumbnails jpg viejos). Ignora archivos faltantes. */
export async function deleteFileAndVariants(filename: string): Promise<void> {
  const file = basename(filename);
  const paths = [
    `${UPLOADS_DIR}/${file}`,
    `${UPLOADS_DIR}/thumbs/${file}`,
    `${UPLOADS_DIR}/thumbs/${variantName(file)}`,
    `${UPLOADS_DIR}/medium/${variantName(file)}`,
  ];
  await Promise.all(
    paths.map((path) =>
      unlink(path).catch((err) => {
        if (err?.code !== 'ENOENT') {
          console.log('Error al borrar el archivo: ', path, err);
        }
      }),
    ),
  );
}
