import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1789595032089 implements MigrationInterface {
    name = 'InitSchema1789595032089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "full_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item_id" uuid NOT NULL, "kind" character varying(150) NOT NULL, "mime_type" character varying(100) NOT NULL, "filename" character varying NOT NULL, "url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1694151a181c7e2d198b1c07545" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_items" ("id" uuid NOT NULL, "category_id" character varying NOT NULL, "sku" character varying NOT NULL, "name" character varying, "qty" integer NOT NULL DEFAULT '0', "location" character varying, "latitude" double precision, "longitude" double precision, "created_by_user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_395ec8d9e0cad6e3890b989fc1c" UNIQUE ("sku"), CONSTRAINT "PK_cf2f451407242e132547ac19169" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item_photos" ADD CONSTRAINT "FK_230c81b221e78373a2fcf20753f" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_159f60e23074d040e4fe40bb267" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_159f60e23074d040e4fe40bb267"`);
        await queryRunner.query(`ALTER TABLE "item_photos" DROP CONSTRAINT "FK_230c81b221e78373a2fcf20753f"`);
        await queryRunner.query(`DROP TABLE "inventory_items"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "item_photos"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
