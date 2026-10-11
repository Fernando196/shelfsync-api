import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueNoCodeDescription1791705697644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_product_lookup_description_nocode" ON "product_lookup" (lower(trim("description"))) WHERE "barcode" IS NULL AND "sku" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UQ_product_lookup_description_nocode"`);
  }
}
