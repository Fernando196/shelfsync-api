import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTables1790716205611 implements MigrationInterface {
  name = 'UpdateTables1790716205611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_9f89e7ae1d39832e3921b18eb92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ALTER COLUMN "product_lookup_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_lookup" ADD CONSTRAINT "CHK_product_lookup_code" CHECK ("barcode" IS NOT NULL OR "sku" IS NOT NULL)`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_9f89e7ae1d39832e3921b18eb92" FOREIGN KEY ("product_lookup_id") REFERENCES "product_lookup"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "sku"`);
    await queryRunner.query(
      `ALTER TABLE "product_lookup" ADD CONSTRAINT "UQ_db6f6bfd7bd6c19a12eaaea5bf5" UNIQUE ("barcode")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_lookup" ADD CONSTRAINT "UQ_62f5d8e0715354c38d0c5083882" UNIQUE ("sku")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_9f89e7ae1d39832e3921b18eb92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_lookup" DROP CONSTRAINT "CHK_product_lookup_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ALTER COLUMN "product_lookup_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_9f89e7ae1d39832e3921b18eb92" FOREIGN KEY ("product_lookup_id") REFERENCES "product_lookup"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_lookup" DROP CONSTRAINT "UQ_62f5d8e0715354c38d0c5083882"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_lookup" DROP CONSTRAINT "UQ_db6f6bfd7bd6c19a12eaaea5bf5"`,
    );
    await queryRunner.query(`ALTER TABLE "inventory_items" ADD "sku" character varying`);
  }
}
