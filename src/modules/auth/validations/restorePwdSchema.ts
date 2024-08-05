import * as zod from "zod";
import { formErrors } from "../../../shared/constant/form-errors.constant";

export const requestPwdRestoreSchema = zod.object({
  email: zod
    .string({ required_error: formErrors.fr.required("Email") })
    .trim()
    .email(formErrors.fr.email),
});

export const restorePwdSchema = zod
  .object({
    token: zod
      .string({ required_error: formErrors.fr.required("Token") })
      .trim(),
    password: zod
      .string({
        required_error: formErrors.fr.required("Mot de passe"),
      })
      .trim()
      .min(6, formErrors.fr.min("Mot de passe", 6)),
    confirmPassword: zod
      .string({
        required_error: formErrors.fr.required("Confirmation de mot de passe"),
      })
      .trim()
      .min(6, formErrors.fr.min("Confirmation de mot de passe", 6)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: formErrors.fr.confirmPassword,
    path: ["confirmPassword"],
  });
