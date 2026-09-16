import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateModels1789600849406 implements MigrationInterface {
    name = 'UpdateModels1789600849406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_971f81500b65c577edd00dd2687"`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "updated_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_971f81500b65c577edd00dd2687" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_971f81500b65c577edd00dd2687"`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "updated_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_971f81500b65c577edd00dd2687" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
