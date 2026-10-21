import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemCoverPhoto1792605275128 implements MigrationInterface {
    name = 'AddItemCoverPhoto1792605275128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "cover_photo_id" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_82281f9babfa8d3e33582b9031d" FOREIGN KEY ("cover_photo_id") REFERENCES "item_files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_82281f9babfa8d3e33582b9031d"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "cover_photo_id"`);
    }

}
