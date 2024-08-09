import { MigrationInterface, QueryRunner } from "typeorm";
import { ENTITY_DELETED } from "../../shared/constant/entity-state.constant";

export class CardExistView1723189945520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `create view v_cards_exist as select * from cards where state != ${ENTITY_DELETED}`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("drop view v_cards_exists");
  }
}

