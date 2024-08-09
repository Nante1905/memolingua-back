import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserPackage1723202217754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "alter table packages alter column id_theme drop not null"
    );
    await queryRunner.query(
      "alter table packages alter column id_langage drop not null"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "alter table packages alter column id_theme set not null"
    );
    await queryRunner.query(
      "alter table packages alter column id_langage set not null"
    );
  }
}

