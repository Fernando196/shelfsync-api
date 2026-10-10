import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateKey1791662489267 implements MigrationInterface {
    name = 'UpdateKey1791662489267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_lookup" DROP CONSTRAINT "CHK_product_lookup_code"`);
        await queryRunner.query(`ALTER TABLE "product_lookup" ADD CONSTRAINT "CHK_product_lookup_identity" CHECK ("barcode" IS NOT NULL OR "sku" IS NOT NULL OR "description" IS NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_lookup" DROP CONSTRAINT "CHK_product_lookup_identity"`);
        await queryRunner.query(`ALTER TABLE "product_lookup" ADD CONSTRAINT "CHK_product_lookup_code" CHECK (((barcode IS NOT NULL) OR (sku IS NOT NULL)))`);
    }

}
