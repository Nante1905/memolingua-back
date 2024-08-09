import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreationDatePackage1723185644458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE packages  ADD COLUMN creation_date timestamp with time zone default now()"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE packages DROP COLUMN creation_date");
  }
}

