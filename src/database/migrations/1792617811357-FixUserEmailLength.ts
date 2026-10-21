import { MigrationInterface, QueryRunner } from "typeorm";

// La entidad declara email varchar(50) pero la columna quedó como varchar sin límite;
// migration:generate lo resolvía con DROP/ADD (borrando los emails). Aquí solo se cambia el tipo.
export class FixUserEmailLength1792617811357 implements MigrationInterface {
    name = 'FixUserEmailLength1792617811357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying`);
    }

}
