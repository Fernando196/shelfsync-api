import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodeInventoryItems1790721368060 implements MigrationInterface {
    name = 'AddCodeInventoryItems1790721368060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "code" integer GENERATED ALWAYS AS IDENTITY NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "UQ_0f18921d7116468ac6932644383" UNIQUE ("code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "UQ_0f18921d7116468ac6932644383"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "code"`);
    }

}
