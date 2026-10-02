import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnProductLookup1790896020178 implements MigrationInterface {
    name = 'AddColumnProductLookup1790896020178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_lookup" ADD "need_assembly" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_lookup" DROP COLUMN "need_assembly"`);
    }

}
