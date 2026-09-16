import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItem1789598286749 implements MigrationInterface {
    name = 'UpdateItem1789598286749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item_id" uuid NOT NULL, "kind" character varying(150) NOT NULL, "mime_type" character varying(100) NOT NULL, "filename" character varying NOT NULL, "url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0eef72470657e353142a57aa3cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item_file" ADD CONSTRAINT "FK_62a009939fc759d8df3fe6d73be" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_file" DROP CONSTRAINT "FK_62a009939fc759d8df3fe6d73be"`);
        await queryRunner.query(`DROP TABLE "item_file"`);
    }

}
