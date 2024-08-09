import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicPackageView1723191071229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "create view v_package_public as select p.* from packages p join user_profiles u on p.id_author = u.id join roles r on u.id_role = r.id"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("drop view v_package_public");
  }
}

