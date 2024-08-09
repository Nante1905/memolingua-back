import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "./Card";

@Entity("packages")
export class Package extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;
  @Column({ name: "img_path" })
  imgPath: string;
  @Column({ default: 0, nullable: false })
  state: number;
  @Column({ name: "id_theme", nullable: false })
  idTheme: string;
  @Column({ name: "id_langage", nullable: false })
  idLangage: string;
  @Column({ name: "id_author", nullable: false })
  idAuthor: string;
  @Column({
    name: "creation_date",
    default: () => "now()",
    type: "timestamp with time zone",
  })
  creationDate: Date;

  @OneToMany(() => Card, (c) => c.package)
  cards: Card[];
}
