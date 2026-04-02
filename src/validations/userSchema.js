import * as yup from "yup";

// Campos compartilhados para evitar repetição
const baseFields = {
  first_name: yup.string().required("Nome obrigatório"),
  last_name: yup.string().required("Apelido obrigatório"),
  email: yup
    .string()
    .email("Email inválido")
    .required("Email obrigatório"),
  role: yup
    .string()
    .oneOf(["dept_manager", "team_member"], "Role inválida")
    .required("Role obrigatória"),
  department: yup.string().required("Departamento obrigatório"),
};

// Schema para CRIAR (Senha Obrigatória)
export const userSchema = yup.object().shape({
  ...baseFields,
  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha obrigatória"),
});

// Schema para EDITAR (Sem senha)
export const userUpdateSchema = yup.object().shape({
  ...baseFields,
});
