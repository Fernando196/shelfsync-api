import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMenu1792617413591 implements MigrationInterface {
    name = 'AddMenu1792617413591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "path" character varying(200) NOT NULL, "icon" character varying(100), "parent_id" uuid, "order" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_59140852a09bf896aacf2140287" UNIQUE ("path"), CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "menu_id" uuid NOT NULL, "can_view" boolean NOT NULL DEFAULT false, "can_create" boolean NOT NULL DEFAULT false, "can_edit" boolean NOT NULL DEFAULT false, "can_delete" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_menu_users_user_menu" UNIQUE ("user_id", "menu_id"), CONSTRAINT "PK_19fc6fdb29277133f7abda65a9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_e5e28130fd17f88ab5ee5d3aa4c" FOREIGN KEY ("parent_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_users" ADD CONSTRAINT "FK_4ec71c751e638457bc88add2c95" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_users" ADD CONSTRAINT "FK_1092c1997cb98011f43e9b4bbe8" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Seed: menú base y, por ahora, acceso total para todos los usuarios existentes.
        await queryRunner.query(`INSERT INTO "menu" ("name", "path", "icon", "order") VALUES
            ('Dashboard', '/', 'dashboard', 1),
            ('Inventario', '/inventory', 'inventory', 2),
            ('Catálogos', '/catalogs', 'catalogs', 3),
            ('Usuarios', '/users', 'users', 4)`);
        await queryRunner.query(`INSERT INTO "menu_users" ("user_id", "menu_id", "can_view", "can_create", "can_edit", "can_delete")
            SELECT u."id", m."id", true, true, true, true FROM "users" u CROSS JOIN "menu" m`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_users" DROP CONSTRAINT "FK_1092c1997cb98011f43e9b4bbe8"`);
        await queryRunner.query(`ALTER TABLE "menu_users" DROP CONSTRAINT "FK_4ec71c751e638457bc88add2c95"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_e5e28130fd17f88ab5ee5d3aa4c"`);
        await queryRunner.query(`DROP TABLE "menu_users"`);
        await queryRunner.query(`DROP TABLE "menu"`);
    }

}
