import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInventoryItems1789595363324 implements MigrationInterface {
    name = 'UpdateInventoryItems1789595363324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_934d5a332b6870c7bb95643ab41" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_934d5a332b6870c7bb95643ab41"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "category_id" character varying NOT NULL`);
    }

}
