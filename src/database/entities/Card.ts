import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Package } from "./Package";

@Entity("cards")
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  recto: string;
  @Column({ nullable: false })
  verso: string;
  @Column({ name: "id_package" })
  idPackage: string;
  @Column({ name: "id_author" })
  idAuthor: string;
  @Column({ nullable: false, default: 0 })
  state: number;

  @ManyToOne(() => Package)
  @JoinColumn({ name: "id_package" })
  package: Package;
}
