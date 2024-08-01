import { MigrationInterface, QueryRunner } from "typeorm";

export class UserView1722498995709 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE VIEW v_user_lib as select u.*, r.label as role, r.code as role_code from user_profiles u join roles r on u.id_role = r.id"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE view v_user_lib");
  }
}

