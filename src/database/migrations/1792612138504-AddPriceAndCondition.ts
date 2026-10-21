import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceAndCondition1792612138504 implements MigrationInterface {
    name = 'AddPriceAndCondition1792612138504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "price" numeric(10,2)`);
        await queryRunner.query(`CREATE TYPE "public"."inventory_items_condition_enum" AS ENUM('new', 'used_like_new', 'used_good', 'used_fair')`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "condition" "public"."inventory_items_condition_enum" NOT NULL DEFAULT 'new'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "condition"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_items_condition_enum"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "price"`);
    }

}
