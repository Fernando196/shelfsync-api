import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediumUrl1792611894966 implements MigrationInterface {
    name = 'AddMediumUrl1792611894966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_files" ADD "medium_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_files" DROP COLUMN "medium_url"`);
    }

}
