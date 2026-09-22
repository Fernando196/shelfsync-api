import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnFile1790113271166 implements MigrationInterface {
    name = 'AddColumnFile1790113271166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_files" ADD "original_name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_files" DROP COLUMN "original_name"`);
    }

}
