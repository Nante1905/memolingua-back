import * as zod from "zod";

export const authSchema = zod.object({
  email: zod
    .string({ required_error: "Veuillez fournir un email." })
    .trim()
    .email("Veuillez fournir un email valide."),
  pwd: zod
    .string({ required_error: "Veuillez fournir un mot de passe" })
    .trim(),
});
