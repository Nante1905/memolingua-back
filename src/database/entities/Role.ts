import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles")
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  label: string;

  @Column({ unique: true })
  code: string;
}
