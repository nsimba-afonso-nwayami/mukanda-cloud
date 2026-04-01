// services/departmentService.js

import { api } from "./api";

/**
 * HELPERS
 */
const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const getData = (res) => res?.data;

/**
 * SLUG GENERATOR
 */
const slugify = (text) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

/**
 * ADAPTER
 */
const adaptDepartment = (item) => ({
  id: item.id,
  name: item.name,
  pessoas: item.users_count || 0,
});

/**
 * =========================
 * API
 * =========================
 */

export const getDepartments = async () => {
  const res = await api.get("auth/departments/");
  return normalizeList(getData(res)).map(adaptDepartment);
};

export const createDepartment = async (data) => {
  const payload = {
    name: data.nome,
    slug: slugify(data.nome),
  };

  const res = await api.post("auth/departments/", payload);
  return getData(res);
};

export const updateDepartment = async (id, name) => {
  const payload = {
    name,
    slug: slugify(name),
  };

  const res = await api.patch(`auth/departments/${id}/`, payload);
  return getData(res);
};

export const deleteDepartment = async (id) => {
  await api.delete(`auth/departments/${id}/`);
};