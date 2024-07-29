import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1721288106871 implements MigrationInterface {
  name = "Test1721288106871";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employe" ADD "age" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employe" DROP COLUMN "age"`);
  }
}

