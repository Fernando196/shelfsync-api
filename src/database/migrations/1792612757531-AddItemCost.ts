import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemCost1792612757531 implements MigrationInterface {
    name = 'AddItemCost1792612757531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "cost" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "cost"`);
    }

}
