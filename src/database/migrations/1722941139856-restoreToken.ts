import { MigrationInterface, QueryRunner } from "typeorm";

export class RestoreToken1722941139856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "create table restore_token ( token VARCHAR(130) primary key, id_user VARCHAR(10) not null REFERENCES user_profiles(id),expiration_date TIMESTAMP with time zone not null)"
    );
    await queryRunner.query(
      "ALTER TABLE restore_token ALTER COLUMN TOKEN TYPE TEXT"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE restore_token ALTER COLUMN TOKEN TYPE VARCHAR(255)"
    );
    await queryRunner.query("drop table restore_token");
  }
}
