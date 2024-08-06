import { MigrationInterface, QueryRunner } from "typeorm";

export class RestoreToken1722941139856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE restore_token ALTER COLUMN TOKEN TYPE TEXT"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE restore_token ALTER COLUMN TOKEN TYPE VARCHAR(255)"
    );
  }
}

