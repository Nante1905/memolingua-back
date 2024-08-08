import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { QuizQuestion } from "./QuizQuestion";

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryColumn({ generated: "identity" })
  id: string;

  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  state: number;
  @Column({ name: "creation_date" })
  creationDate: Date;
  @Column({ name: "id_level" })
  idLevel: string;
  @Column({ name: "id_theme" })
  idTheme: string;
  @Column({ name: "img_path" })
  imgPath: string;

  @OneToMany(() => QuizQuestion, (q) => q.quiz)
  questions: QuizQuestion[];
}
