import { MigrationInterface, QueryRunner } from "typeorm";

export class Huhu1721391395760 implements MigrationInterface {
  name = "Huhu1721391395760";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employe" DROP CONSTRAINT "fk_direction"`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" DROP CONSTRAINT "employe_id_category_fkey"`
    );
    await queryRunner.query(`DROP INDEX "public"."fki_fk_direction"`);
    await queryRunner.query(`ALTER TABLE "employe" DROP COLUMN "id_category"`);
    await queryRunner.query(
      `ALTER TABLE "direction" ALTER COLUMN "id" DROP DEFAULT`
    );
    await queryRunner.query(`DROP SEQUENCE "direction_id_seq"`);
    await queryRunner.query(`ALTER TABLE "direction" DROP COLUMN "nom"`);
    await queryRunner.query(
      `ALTER TABLE "direction" ADD "nom" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ADD CONSTRAINT "PK_7113be6659833171e74fa251a18" PRIMARY KEY ("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ALTER COLUMN "id" DROP DEFAULT`
    );
    await queryRunner.query(`DROP SEQUENCE "employe_id_seq"`);
    await queryRunner.query(`ALTER TABLE "employe" DROP COLUMN "nom"`);
    await queryRunner.query(
      `ALTER TABLE "employe" ADD "nom" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ALTER COLUMN "id_direction" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ADD CONSTRAINT "FK_a3577e5ac783ea32483bb5b14a6" FOREIGN KEY ("id_direction") REFERENCES "direction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employe" DROP CONSTRAINT "FK_a3577e5ac783ea32483bb5b14a6"`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ALTER COLUMN "id_direction" DROP NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "employe" DROP COLUMN "nom"`);
    await queryRunner.query(
      `ALTER TABLE "employe" ADD "nom" character varying(255)`
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "employe_id_seq" OWNED BY "employe"."id"`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ALTER COLUMN "id" SET DEFAULT nextval('"employe_id_seq"')`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" DROP CONSTRAINT "PK_7113be6659833171e74fa251a18"`
    );
    await queryRunner.query(`ALTER TABLE "direction" DROP COLUMN "nom"`);
    await queryRunner.query(
      `ALTER TABLE "direction" ADD "nom" character varying(100)`
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "direction_id_seq" OWNED BY "direction"."id"`
    );
    await queryRunner.query(
      `ALTER TABLE "direction" ALTER COLUMN "id" SET DEFAULT nextval('"direction_id_seq"')`
    );
    await queryRunner.query(`ALTER TABLE "employe" ADD "id_category" integer`);
    await queryRunner.query(
      `CREATE INDEX "fki_fk_direction" ON "employe" ("id_direction") `
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ADD CONSTRAINT "employe_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "employe" ADD CONSTRAINT "fk_direction" FOREIGN KEY ("id_direction") REFERENCES "direction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}

