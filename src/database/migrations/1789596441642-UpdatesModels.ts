import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatesModels1789596441642 implements MigrationInterface {
    name = 'UpdatesModels1789596441642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_159f60e23074d040e4fe40bb267"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "created_by_user_id"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "created_by" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "updated_by" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "created_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updated_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_23ad9291e0e22cdf46ae7ec5461" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_971f81500b65c577edd00dd2687" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_d3b644cf95e87404a2f5891bd04" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_2a9d2941176858654488589358c" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_2a9d2941176858654488589358c"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_d3b644cf95e87404a2f5891bd04"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_971f81500b65c577edd00dd2687"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_23ad9291e0e22cdf46ae7ec5461"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updated_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "created_by_user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_159f60e23074d040e4fe40bb267" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
