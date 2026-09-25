import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductLookup1790299791041 implements MigrationInterface {
    name = 'AddProductLookup1790299791041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_lookup" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "barcode" character varying(150), "sku" character varying(150), "description" character varying(1000), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_by" uuid, CONSTRAINT "PK_8caa9885680dd3e008c95c27e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "product_lookup_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product_lookup" ADD CONSTRAINT "FK_f63d14a53cf6fb0f282f1cc74cc" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_lookup" ADD CONSTRAINT "FK_3e5629a4083a5fbda15d22af9d9" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_9f89e7ae1d39832e3921b18eb92" FOREIGN KEY ("product_lookup_id") REFERENCES "product_lookup"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_9f89e7ae1d39832e3921b18eb92"`);
        await queryRunner.query(`ALTER TABLE "product_lookup" DROP CONSTRAINT "FK_3e5629a4083a5fbda15d22af9d9"`);
        await queryRunner.query(`ALTER TABLE "product_lookup" DROP CONSTRAINT "FK_f63d14a53cf6fb0f282f1cc74cc"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "product_lookup_id"`);
        await queryRunner.query(`DROP TABLE "product_lookup"`);
    }

}
