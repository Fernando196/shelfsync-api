import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemStatusHistory1790300832143 implements MigrationInterface {
    name = 'AddItemStatusHistory1790300832143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."item_status_history_from_status_enum" AS ENUM('received', 'pending_assembly', 'assembling', 'ready', 'sold', 'damaged')`);
        await queryRunner.query(`CREATE TYPE "public"."item_status_history_to_status_enum" AS ENUM('received', 'pending_assembly', 'assembling', 'ready', 'sold', 'damaged')`);
        await queryRunner.query(`CREATE TABLE "item_status_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item_id" uuid NOT NULL, "from_status" "public"."item_status_history_from_status_enum", "to_status" "public"."item_status_history_to_status_enum" NOT NULL, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), "changed_by" uuid, CONSTRAINT "PK_0eb680a278a19be095bc0794b79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."inventory_items_status_enum" AS ENUM('received', 'pending_assembly', 'assembling', 'ready', 'sold', 'damaged')`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "status" "public"."inventory_items_status_enum" NOT NULL DEFAULT 'received'`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "received_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "assembly_started_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "assembly_finished_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "item_status_history" ADD CONSTRAINT "FK_12bd55c0e1c37468cdf469837b1" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_status_history" ADD CONSTRAINT "FK_2075f212d52407c3c1d51ec8a16" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_status_history" DROP CONSTRAINT "FK_2075f212d52407c3c1d51ec8a16"`);
        await queryRunner.query(`ALTER TABLE "item_status_history" DROP CONSTRAINT "FK_12bd55c0e1c37468cdf469837b1"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "assembly_finished_at"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "assembly_started_at"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "received_at"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_items_status_enum"`);
        await queryRunner.query(`DROP TABLE "item_status_history"`);
        await queryRunner.query(`DROP TYPE "public"."item_status_history_to_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."item_status_history_from_status_enum"`);
    }

}
