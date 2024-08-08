import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAnswer1723031165088 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "alter table quiz_correct_answer rename to quiz_answer"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "alter table quiz_answer rename to quiz_correct_answer"
    );
  }
}

