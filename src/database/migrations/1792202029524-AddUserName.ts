import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserName1792202029524 implements MigrationInterface {
    name = 'AddUserName1792202029524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "user_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_name"`);
    }

}
