import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";

@Entity("user_profiles")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  gender: number;

  @Column()
  birthday: Date;

  @Column()
  email: string;

  @Column()
  pwd: string;

  @Column({ name: "avatar_img" })
  avatarPath: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "id_role" })
  role: Role;
}
