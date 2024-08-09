import { MigrationInterface, QueryRunner } from "typeorm";

export class NbCardPackageView1723191770276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "create MATERIALIZED view mv_nb_card_package as select id_package, count(*) nb from v_cards_exist group by id_package"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("drop materialized view mv_nb_card_package");
  }
}

