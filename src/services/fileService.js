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

const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch {
    return null;
  }
};

const getToken = () => localStorage.getItem("access_token");

/**
 * =========================
 * PERMISSION BITMASK
 * =========================
 */

export const buildPermissionMask = (perms = {}) => {
  let mask = 0;
  if (perms.ler) mask |= 1;
  if (perms.escrever) mask |= 2;
  if (perms.executar) mask |= 4; 
  if (perms.apagar) mask |= 8;
  return mask;
};

export const parsePermissionMask = (mask = 0) => ({
  ler: Boolean(mask & 1),
  escrever: Boolean(mask & 2),
  executar: Boolean(mask & 4),
  apagar: Boolean(mask & 8),
});

/**
 * =========================
 * ADAPTERS
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
  permissions: item.permissions || null,
});

/**
 * =========================
 * NODES (FileSystem)
 * =========================
 */

export const getNodes = async (params = {}) => {
  const response = await api.get("files/nodes/", { params });
  const data = normalizeList(getData(response));
  return data.map(adaptNode);
};

export const getNodeById = async (id) => {
  const response = await api.get(`files/nodes/${id}/`);
  return adaptNode(getData(response));
};

export const createFolder = async (data) => {
  const user = getUser();
  
  const payload = {
    name: data.nome,
    node_type: "folder",
    parent: data.parent || null,
    // Prioridade: 1. Dept vindo do form | 2. Dept do user logado | 3. Nulo
    department: data.department || user?.dept_id || user?.department || null,
  };

  const response = await api.post("files/nodes/", payload);
  return getData(response);
};

export const uploadFile = async (file, parentId = null) => {
  const user = getUser();
  const formData = new FormData();

  formData.append("file_field", file);
  formData.append("node_type", "file");
  
  if (parentId) formData.append("parent", parentId);

  const deptId = user?.dept_id || user?.department;
  if (deptId) formData.append("department", deptId);

  const response = await api.post("files/nodes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return getData(response);
};

export const updateNode = async (id, data) => {
  const response = await api.patch(`files/nodes/${id}/`, data);
  return getData(response);
};

export const deleteNode = async (id) => {
  await api.delete(`files/nodes/${id}/`);
};

export const downloadFile = async (id, filename) => {
  const token = getToken();
  const baseURL = api.defaults.baseURL.endsWith('/') 
    ? api.defaults.baseURL 
    : `${api.defaults.baseURL}/`;
    
  const url = `${baseURL}files/nodes/${id}/download/`;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) throw new Error("Falha no download");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    
    anchor.href = objectUrl;
    anchor.download = filename || "documento";
    document.body.appendChild(anchor);
    anchor.click();
    
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
  } catch (error) {
    console.error("Erro ao descarregar ficheiro:", error);
    throw error;
  }
};

/**
 * =========================
 * USER PERMISSIONS (ACL)
 * =========================
 */

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
  }));
};

export const createPermission = async ({ userId, nodeId, perms }) => {
  const currentUser = getUser();
  const payload = {
    user: userId,
    node: nodeId,
    permission_mask: buildPermissionMask(perms),
    assigned_by: currentUser?.id,
  };

  const response = await api.post("files/permissions/", payload);
  return getData(response);
};

export const updatePermission = async (id, perms) => {
  const payload = { permission_mask: buildPermissionMask(perms) };
  const response = await api.patch(`files/permissions/${id}/`, payload);
  return getData(response);
};

export const deletePermission = async (id) => {
  await api.delete(`files/permissions/${id}/`);
};

/**
 * =========================
 * CROSS-DEPARTMENT PERMISSIONS
 * =========================
 */

export const getCrossDeptPermissions = async (params = {}) => {
  const response = await api.get("auth/cross-dept-permissions/", { params });
  const data = normalizeList(getData(response));

  return data.map((perm) => ({
    id: perm.id,
    grantor_dept: perm.grantor_department,
    grantee_dept: perm.grantee_department,
    mask: perm.permission_mask,
    parsed: parsePermissionMask(perm.permission_mask),
    is_active: perm.is_active,
    expires_at: perm.expires_at,
  }));
};

export const createCrossDeptPermission = async ({ grantorId, granteeId, perms }) => {
  const payload = {
    grantor_department: grantorId,
    grantee_department: granteeId,
    permission_mask: buildPermissionMask(perms),
  };
  const response = await api.post("auth/cross-dept-permissions/", payload);
  return getData(response);
};

export const updateCrossDeptPermission = async (id, perms) => {
  const payload = { permission_mask: buildPermissionMask(perms) };
  const response = await api.patch(`auth/cross-dept-permissions/${id}/`, payload);
  return getData(response);
};

export const deleteCrossDeptPermission = async (id) => {
  await api.delete(`auth/cross-dept-permissions/${id}/`);
};