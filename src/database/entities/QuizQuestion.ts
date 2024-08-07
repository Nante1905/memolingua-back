import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Quiz } from "./Quiz";
import { QuizAnswer } from "./QuizAnswer";

@Entity()
export class QuizQuestion extends BaseEntity {
  @PrimaryColumn({ generated: "identity" })
  id: string;

  @Column()
  question: string;
  @Column()
  state: number;
  @Column({ name: "id_quiz" })
  idQuiz: number;
  @Column({ name: "is_qcm" })
  isQcm: boolean;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "id_quiz" })
  quiz: Quiz;

  @OneToMany(() => QuizAnswer, (q) => q.question)
  answers: QuizAnswer[];
}
