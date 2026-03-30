import { api } from "./api";

/**
 * =========================
 * HELPERS INTERNOS
 * =========================
 */

// 🔥 normaliza respostas da API (array ou paginado DRF)
const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

// 🔥 extrai data segura
const getData = (response) => response?.data;


/**
 * =========================
 * NODES (PASTAS + FILES)
 * =========================
 */

// LISTAR TODOS OS NODES
export const getNodes = async (params = {}) => {
  const response = await api.get("files/nodes/", { params });
  return normalizeList(getData(response));
};

// OBTER NODE POR ID
export const getNodeById = async (id) => {
  const response = await api.get(`files/nodes/${id}/`);
  return getData(response);
};

// CRIAR PASTA
export const createFolder = async (data) => {
  const payload = {
    name: data.nome,
    type: "folder",
    permissions: data.permissoes || {},
    parent: data.parent || null,
  };

  const response = await api.post("files/nodes/", payload);
  return getData(response);
};

// UPLOAD DE ARQUIVO
export const uploadFile = async (file, parentId = null) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("type", "file");

  if (parentId) {
    formData.append("parent", parentId);
  }

  const response = await api.post("files/nodes/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return getData(response);
};

// ATUALIZAR NODE GENÉRICO
export const updateNode = async (id, data) => {
  const response = await api.patch(`files/nodes/${id}/`, data);
  return getData(response);
};

// RENOMEAR NODE
export const renameNode = async (id, name) => {
  const response = await api.patch(`files/nodes/${id}/`, { name });
  return getData(response);
};

// MOVER NODE (ALTERAR PASTA PAI)
export const moveNode = async (id, parentId) => {
  const response = await api.patch(`files/nodes/${id}/`, {
    parent: parentId,
  });

  return getData(response);
};

// DELETAR NODE
export const deleteNode = async (id) => {
  await api.delete(`files/nodes/${id}/`);
};


/**
 * =========================
 * PERMISSIONS
 * =========================
 */

// LISTAR PERMISSÕES
export const getPermissions = async () => {
  const response = await api.get("files/permissions/");
  return normalizeList(getData(response));
};

// OBTER PERMISSÃO
export const getPermissionById = async (id) => {
  const response = await api.get(`files/permissions/${id}/`);
  return getData(response);
};

// CRIAR PERMISSÃO
export const createPermission = async (data) => {
  const response = await api.post("files/permissions/", data);
  return getData(response);
};

// ATUALIZAR PERMISSÃO
export const updatePermission = async (id, data) => {
  const response = await api.patch(`files/permissions/${id}/`, data);
  return getData(response);
};

// DELETAR PERMISSÃO
export const deletePermission = async (id) => {
  await api.delete(`files/permissions/${id}/`);
};