import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../../database/data-source";
import { Quiz } from "../../../database/entities/Quiz";
import { QuizAnswer } from "../../../database/entities/QuizAnswer";
import { QuizQuestion } from "../../../database/entities/QuizQuestion";
import {
  DEFAULT_ITEM_PER_PAGE,
  DEFAULT_PAGE_NUMBER,
} from "../../../shared/constant/pagination.constant";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { getQuetionsByQuizId, getQuizByThemes } from "../services/quiz.service";
export class QuizController {
  static async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await getQuetionsByQuizId(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async createQuiz(req: Request, res: Response, next: NextFunction) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const quiz = new Quiz();
      Object.assign(quiz, req.body);
      const idQuiz = (await queryRunner.manager.save(quiz)).id;
      for (let e of quiz.questions) {
        const question = new QuizQuestion();
        Object.assign(question, e);
        question.idQuiz = idQuiz;
        const idQuestion = (await queryRunner.manager.save(question)).id;

        for (let a of e.answers) {
          const answer = new QuizAnswer();
          Object.assign(answer, a);
          answer.idQuestion = idQuestion;
          // answer.state = 0;
          await queryRunner.manager.save(answer);
        }
      }

      await queryRunner.commitTransaction();
      // console.log(id);
      res.json({ message: "Quiz created successfully" });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      next(error);
    }
  }

  static async getQuizByTheme(req: Request, res: Response, next: NextFunction) {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    try {
      const data = await getQuizByThemes(
        req.params.idTheme,
        isNaN(page) || page === 0 ? DEFAULT_PAGE_NUMBER : page,
        isNaN(limit) || limit === 0 ? DEFAULT_ITEM_PER_PAGE : limit
      );
      res.json(new ApiResponse({ ok: true, payload: data }));
    } catch (err) {
      next(err);
    }
  }
}
