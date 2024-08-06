export const formErrors = {
  fr: {
    required: (field: string) => `${field} obligatoire`,
    email: "Email non valide",
    confirmPassword: "Mot de passe ne correspond pas",
    min: (field: string, n: number) => `${field} doit contenir ${n} caractères`,
  },
};
