import * as yup from "yup";

export const departmentSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(2, "Mínimo 2 caracteres"),
});