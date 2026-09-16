import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameItem1789598341589 implements MigrationInterface {
    name = 'RenameItem1789598341589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item_id" uuid NOT NULL, "kind" character varying(150) NOT NULL, "mime_type" character varying(100) NOT NULL, "filename" character varying NOT NULL, "url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f24c095dfe3b13bcc441c55149b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item_files" ADD CONSTRAINT "FK_1ddd3f505606cca6718eaca5f6c" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_files" DROP CONSTRAINT "FK_1ddd3f505606cca6718eaca5f6c"`);
        await queryRunner.query(`DROP TABLE "item_files"`);
    }

}
