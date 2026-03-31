// services/fileService.js

import { api } from "./api";

/**
 * =========================
 * HELPERS
 * =========================
 */

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const getData = (response) => response?.data;

// pega user do localStorage
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

/**
 * =========================
 * PERMISSION BITMASK
 * =========================
 */

// converte objeto → bitmask
export const buildPermissionMask = (perms = {}) => {
  let mask = 0;

  if (perms.ler) mask |= 1;
  if (perms.escrever) mask |= 2;
  if (perms.executar) mask |= 4;
  if (perms.apagar) mask |= 8;

  return mask;
};

// converte bitmask → objeto
export const parsePermissionMask = (mask = 0) => ({
  ler: Boolean(mask & 1),
  escrever: Boolean(mask & 2),
  executar: Boolean(mask & 4),
  apagar: Boolean(mask & 8),
});

/**
 * =========================
 * ADAPTER BACKEND → FRONTEND
 * =========================
 */

const adaptNode = (item) => ({
  id: item.id,
  name: item.name,
  type: item.node_type,
  size: item.size_display || null,
  rawSize: item.size_bytes || 0,
  department: item.department,
  path: item.materialized_path,
  created_at: item.created_at,
});

/**
 * =========================
 * NODES
 * =========================
 */

// LISTAR
export const getNodes = async (params = {}) => {
  const response = await api.get("files/nodes/", { params });

  const data = normalizeList(getData(response));

  return data
    .filter((item) => !item.is_deleted)
    .map(adaptNode);
};

// OBTER
export const getNodeById = async (id) => {
  const response = await api.get(`files/nodes/${id}/`);
  return adaptNode(getData(response));
};

// CRIAR PASTA
export const createFolder = async (data) => {
  const user = getUser();

  const payload = {
    name: data.nome,
    node_type: "folder",
    department: user?.department_id || user?.department || null,
  };

  const response = await api.post("files/nodes/", payload);
  return getData(response);
};

// UPLOAD
export const uploadFile = async (file) => {
  const user = getUser();

  const formData = new FormData();

  formData.append("file_field", file);
  formData.append("node_type", "file");

  if (user?.department_id || user?.department) {
    formData.append(
      "department",
      user?.department_id || user?.department
    );
  }

  const response = await api.post("files/nodes/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return getData(response);
};

// RENOMEAR
export const renameNode = async (id, name) => {
  const response = await api.patch(`files/nodes/${id}/`, { name });
  return getData(response);
};

// DELETE
export const deleteNode = async (id) => {
  await api.delete(`files/nodes/${id}/`);
};

/**
 * =========================
 * PERMISSIONS
 * =========================
 */

// LISTAR PERMISSÕES
export const getPermissions = async (params = {}) => {
  const response = await api.get("files/permissions/", { params });

  const data = normalizeList(getData(response));

  return data.map((perm) => ({
    id: perm.id,
    user: perm.user,
    node: perm.node,
    mask: perm.permission_mask,
    parsed: parsePermissionMask(perm.permission_mask),
    is_active: perm.is_active,
    expires_at: perm.expires_at,
  }));
};

// CRIAR PERMISSÃO
export const createPermission = async ({ userId, nodeId, permissoes }) => {
  const currentUser = getUser();

  const payload = {
    user: userId,
    node: nodeId,
    permission_mask: buildPermissionMask(permissoes),
    assigned_by: currentUser?.id,
  };

  const response = await api.post("files/permissions/", payload);
  return getData(response);
};

// ATUALIZAR PERMISSÃO
export const updatePermission = async (id, permissoes) => {
  const payload = {
    permission_mask: buildPermissionMask(permissoes),
  };

  const response = await api.patch(`files/permissions/${id}/`, payload);
  return getData(response);
};

// REMOVER PERMISSÃO
export const deletePermission = async (id) => {
  await api.delete(`files/permissions/${id}/`);
};
