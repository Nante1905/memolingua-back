import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "themes" })
export class Theme extends BaseEntity {
  @PrimaryColumn({ generated: "identity" })
  id: string;
  @Column()
  label: string;
  @Column()
  state: number;
}
