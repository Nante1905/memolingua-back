import { MigrationInterface, QueryRunner } from "typeorm";

export class IsqcmQuestion1723027783754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("alter table quiz_question add is_qcm boolean");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("alter table quiz_question drop column is_qcm");
  }
}

