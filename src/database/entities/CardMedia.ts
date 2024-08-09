import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("card_medias")
export class CardMedia extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    name: "media_type",
    type: "enum",
    enum: ["IMG", "AUD", "VID"],
    nullable: false,
  })
  mediaType: "IMG" | "AUD" | "VID";
  @Column({ name: "media_path", nullable: false })
  mediaPath: string;
  @Column({ name: "id_card", nullable: false })
  idCard: string;
  @Column()
  state: number;
}
