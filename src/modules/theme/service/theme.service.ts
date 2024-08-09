import { MoreThan } from "typeorm";
import { Theme } from "../../../database/entities/Theme";

export const findAllThemes = async () => {
  const data = await Theme.find({
    where: {
      state: MoreThan(-1),
    },
  });
  return data;
};
