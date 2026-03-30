import { api } from "./api";

// 🔹 LISTAR NODES (pastas + arquivos)
export const getNodes = async () => {
  const response = await api.get("files/nodes/");
  return response.data;
};

// 🔹 CRIAR PASTA
export const createFolder = async (data) => {
  const response = await api.post("files/nodes/", {
    name: data.nome,
    type: "folder", // importante!
    permissions: data.permissoes,
  });

  return response.data;
};

// 🔹 UPLOAD DE ARQUIVO
export const uploadFile = async (file, parentId = null) => {
  const formData = new FormData();
  formData.append("file", file);

  if (parentId) {
    formData.append("parent", parentId);
  }

  const response = await api.post("files/nodes/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// 🔹 DELETAR NODE
export const deleteNode = async (id) => {
  await api.delete(`files/nodes/${id}/`);
};