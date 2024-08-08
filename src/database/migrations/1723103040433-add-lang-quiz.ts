import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLangQuiz1723103040433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "alter table quiz add column lang varchar(10) references langages(id)"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("alter table quiz drop column lang");
  }
}

