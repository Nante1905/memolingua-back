import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultStateQa1723101509357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "alter table quiz_answer alter column state set default 0"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "alter table quiz_answer alter column state set default null"
    );
  }
}

