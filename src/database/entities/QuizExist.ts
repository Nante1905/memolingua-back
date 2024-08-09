import { Column, Entity } from "typeorm";
import { Quiz } from "./Quiz";

@Entity({ name: "v_quiz_lib_exist" })
export class QuizExist extends Quiz {
  @Column()
  theme: string;
  @Column({
    name: "level_label",
  })
  level: string;
}
