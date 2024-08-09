import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizLib1723191150214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "create view v_quiz_lib_exist as select q.*, t.label theme, l.label level_label from quiz q join themes t on q.id_theme=t.id join levels l on q.id_level=l.id where q.state>=0"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("drop view v_quiz_lib_exist");
  }
}

