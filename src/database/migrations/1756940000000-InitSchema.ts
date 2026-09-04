import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1756940000000 implements MigrationInterface {
  name = 'InitSchema1756940000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Guarantees gen_random_uuid() regardless of Postgres version.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" text NOT NULL,
        "password_hash" text NOT NULL,
        "full_name" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "inventory_items" (
        "id" uuid NOT NULL,
        "sku" text NOT NULL,
        "name" text,
        "qty" integer NOT NULL DEFAULT 0,
        "location" text,
        "category" text,
        "latitude" double precision,
        "longitude" double precision,
        "created_by_user_id" uuid,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "PK_inventory_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_inventory_items_sku" UNIQUE ("sku"),
        CONSTRAINT "FK_inventory_items_created_by" FOREIGN KEY ("created_by_user_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "item_photos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "item_id" uuid NOT NULL,
        "filename" text NOT NULL,
        "url" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_item_photos_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_item_photos_item" FOREIGN KEY ("item_id")
          REFERENCES "inventory_items"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_inventory_items_deleted_at" ON "inventory_items" ("deleted_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_item_photos_item_id" ON "item_photos" ("item_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_photos"`);
    await queryRunner.query(`DROP TABLE "inventory_items"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
