import * as yup from "yup";

export const fileSchema = yup.object().shape({
  file: yup
    .mixed()
    .required("Nenhum arquivo selecionado")
    .test("fileSize", "Máximo 10MB", (value) => {
      if (!value) return false;
      return value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Tipo de arquivo não permitido", (value) => {
      if (!value) return false;

      const allowedTypes = [
        // PDFs
        "application/pdf",

        // Imagens
        "image/jpeg", // jpg e jpeg
        "image/png",

        // Word
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx

        // Excel
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx

        // PowerPoint
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      ];

      return allowedTypes.includes(value.type);
    }),
});
