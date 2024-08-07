import { QuizQuestion } from "../../../database/entities/QuizQuestion";

export const getQuetionsByQuizId = async (idQuiz: string) => {
  // select qq.*, qa.* from quiz q left join quiz_question qq on q.id=qq.id_quiz left join quiz_answer qa on qa.id_question=qq.id and qq.is_qcm=true
  const data = await QuizQuestion.createQueryBuilder("qq")
    .leftJoin("qq.answers", "qa", "qq.is_qcm=true")
    .addSelect(["qa.id", "qa.answer"])
    .where("qq.id_quiz=:idQuiz", { idQuiz })
    .getMany();
  return data;
};
