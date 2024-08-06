import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("restore_token")
export class RestoreToken extends BaseEntity {
  @PrimaryColumn()
  token: string;

  @Column({ name: "id_user" })
  idUser: string;

  @Column({ name: "expiration_date", type: "timestamp with time zone" })
  expirationDate: Date;
}
