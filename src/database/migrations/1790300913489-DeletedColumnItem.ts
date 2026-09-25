import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletedColumnItem1790300913489 implements MigrationInterface {
    name = 'DeletedColumnItem1790300913489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "received_at"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "assembly_started_at"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "assembly_finished_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "assembly_finished_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "assembly_started_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "received_at" TIMESTAMP`);
    }

}
