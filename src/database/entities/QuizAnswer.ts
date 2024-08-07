import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { QuizQuestion } from "./QuizQuestion";

@Entity({ name: "quiz_answer" })
export class QuizAnswer extends BaseEntity {
  @PrimaryColumn({ generated: "identity" })
  id: string;
  @Column()
  answer: string;
  @Column({ name: "is_correct" })
  isCorrect: boolean;
  @Column()
  state: number;

  @ManyToOne(() => QuizQuestion)
  @JoinColumn({ name: "id_question" })
  question: QuizQuestion;
}
