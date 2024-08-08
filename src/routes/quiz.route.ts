import { Router } from "express";
import { QuizController } from "../modules/quiz/controllers/quiz.controller";

export const quizRouter = Router();

quizRouter.get("/:id/questions", QuizController.getQuestions);

quizRouter.post("/", QuizController.createQuiz);
quizRouter.get("/themes/:idTheme", QuizController.getQuizByTheme);
