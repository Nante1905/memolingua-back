import { QuizExist } from "../../../database/entities/QuizExist";
import { QuizQuestion } from "../../../database/entities/QuizQuestion";
import { Paginated } from "../../../shared/types/Paginated";

export const getQuetionsByQuizId = async (idQuiz: string) => {
  // select qq.*, qa.* from quiz q left join quiz_question qq on q.id=qq.id_quiz left join quiz_answer qa on qa.id_question=qq.id and qq.is_qcm=true
  const data = await QuizQuestion.createQueryBuilder("qq")
    .leftJoin("qq.answers", "qa", "qq.is_qcm=true")
    .addSelect(["qa.id", "qa.answer"])
    .where("qq.id_quiz=:idQuiz", { idQuiz })
    .getMany();
  return data;
};

export const getQuizByThemes = async (
  idTheme: string,
  page: number,
  limit: number
) => {
  const totalQuizs = await QuizExist.createQueryBuilder()
    .where("id_theme=:idTheme", { idTheme })
    .getCount();
  const quizs = await await QuizExist.createQueryBuilder("quiz")
    .leftJoinAndSelect("quiz.questions", "question")
    .where("quiz.idTheme = :idTheme", { idTheme })
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();
  // const quizs = await QuizExist.find({
  //   where: { idTheme },
  //   skip: (page - 1) * limit,
  //   take: limit,
  // });
  const quizsWithQuestionCount = quizs.map((q) => ({
    ...q,
    nbQuestions: q.questions.length,
    questions: [],
  }));

  let paginatedQuizs = new Paginated<any>(
    quizsWithQuestionCount,
    totalQuizs,
    page,
    limit
  );

  return paginatedQuizs;
};
