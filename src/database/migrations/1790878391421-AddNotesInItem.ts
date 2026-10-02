import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotesInItem1790878391421 implements MigrationInterface {
    name = 'AddNotesInItem1790878391421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "notes" character varying(1500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "notes"`);
    }

}
