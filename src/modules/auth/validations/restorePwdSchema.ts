import * as zod from "zod";

export const restorePwdSchema = zod.object({
  email: zod
    .string({ required_error: "Veuillez fournir un email." })
    .trim()
    .email("Veuillez fournir un email valide."),
});
