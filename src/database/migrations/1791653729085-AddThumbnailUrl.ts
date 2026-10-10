import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThumbnailUrl1791653729085 implements MigrationInterface {
    name = 'AddThumbnailUrl1791653729085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_files" ADD "thumbnail_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_files" DROP COLUMN "thumbnail_url"`);
    }

}
