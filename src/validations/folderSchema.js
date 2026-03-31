import * as yup from "yup";

const INVALID_CHARS = /[<>:"/\\|?*\x00-\x1F]/;

export const folderSchema = yup.object().shape({
  nome: yup
    .string()
    .trim()
    .required("O nome da pasta é obrigatório")
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(50, "Deve ter no máximo 50 caracteres")
    .test(
      "invalid-chars",
      "Contém caracteres inválidos (<>:\"/\\|?*)",
      (value) => !INVALID_CHARS.test(value || "")
    ),
});