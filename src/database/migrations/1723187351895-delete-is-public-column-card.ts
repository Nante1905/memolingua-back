import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteIsPublicColumnCard1723187351895
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE cards DROP COLUMN is_public");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE cards ADD COLUMN is_public boolean not null default false"
    );
  }
}

