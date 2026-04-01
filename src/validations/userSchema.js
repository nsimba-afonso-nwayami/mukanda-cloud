import * as yup from "yup";

export const userSchema = yup.object().shape({
  first_name: yup.string().required("Nome obrigatório"),
  last_name: yup.string().required("Apelido obrigatório"),

  email: yup
    .string()
    .email("Email inválido")
    .required("Email obrigatório"),

  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha obrigatória"),

  role: yup
    .string()
    .oneOf(["dept_manager", "team_member"], "Role inválida")
    .required("Role obrigatória"),

  department: yup.string().required("Departamento obrigatório"),
});
