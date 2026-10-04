import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatus1790979086769 implements MigrationInterface {
    name = 'UpdateStatus1790979086769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_status_history" ADD "comment" character varying(1500)`);
        await queryRunner.query(`ALTER TYPE "public"."item_status_history_from_status_enum" ADD VALUE 'paused'`);
        await queryRunner.query(`ALTER TYPE "public"."item_status_history_to_status_enum" ADD VALUE 'paused'`);
        await queryRunner.query(`ALTER TYPE "public"."inventory_items_status_enum" ADD VALUE 'paused'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."inventory_items_status_enum_old" AS ENUM('received', 'pending_assembly', 'assembling', 'ready', 'sold', 'damaged')`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ALTER COLUMN "status" TYPE "public"."inventory_items_status_enum_old" USING "status"::"text"::"public"."inventory_items_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_items_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."inventory_items_status_enum_old" RENAME TO "inventory_items_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."item_status_history_to_status_enum_old" AS ENUM('received', 'pending_assembly', 'assembling', 'ready', 'sold', 'damaged')`);
        await queryRunner.query(`ALTER TABLE "item_status_history" ALTER COLUMN "to_status" TYPE "public"."item_status_history_to_status_enum_old" USING "to_status"::"text"::"public"."item_status_history_to_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."item_status_history_to_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."item_status_history_to_status_enum_old" RENAME TO "item_status_history_to_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."item_status_history_from_status_enum_old" AS ENUM('received', 'pending_assembly', 'assembling', 'ready', 'sold', 'damaged')`);
        await queryRunner.query(`ALTER TABLE "item_status_history" ALTER COLUMN "from_status" TYPE "public"."item_status_history_from_status_enum_old" USING "from_status"::"text"::"public"."item_status_history_from_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."item_status_history_from_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."item_status_history_from_status_enum_old" RENAME TO "item_status_history_from_status_enum"`);
        await queryRunner.query(`ALTER TABLE "item_status_history" DROP COLUMN "comment"`);
    }

}
