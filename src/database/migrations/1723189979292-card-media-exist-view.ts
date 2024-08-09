import { MigrationInterface, QueryRunner } from "typeorm";
import { ENTITY_DELETED } from "../../shared/constant/entity-state.constant";

export class CardMediaExistView1723189979292 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `create view v_card_medias_exist as select * from card_medias where state != ${ENTITY_DELETED}`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("drop view v_card_medias_exists");
  }
}

