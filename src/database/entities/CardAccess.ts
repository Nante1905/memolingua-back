import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("card_access")
export class CardAccess extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "id_sharer", nullable: false })
  idSharer: string;
  @Column({ name: "id_receiver", nullable: false })
  idReceiver: string;
  @Column({ name: "id_card", nullable: false })
  idCard: string;
  @Column({
    name: "shared_date",
    default: () => "now()",
    type: "timestamp with time zone",
  })
  sharedDate: Date;
}
