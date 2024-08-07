import { NextFunction, Request, Response } from "express";
import { getQuetionsByQuizId } from "../services/quiz.service";
export class QuizController {
  static async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await getQuetionsByQuizId(req.params.id);
      console.log(data);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
