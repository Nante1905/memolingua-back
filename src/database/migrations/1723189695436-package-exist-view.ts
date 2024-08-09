import { MigrationInterface, QueryRunner } from "typeorm";
import { ENTITY_DELETED } from "../../shared/constant/entity-state.constant";

export class PackageExistView1723189695436 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `create view v_packages_exist as select * from packages where state != ${ENTITY_DELETED}`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("drop view v_packages_exists");
  }
}

