import { api } from "./api";

const getData = (res) => res?.data;

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
};

const adaptUser = (u) => ({
  id: u.id,
  first_name: u.first_name,
  last_name: u.last_name,
  nome: `${u.first_name} ${u.last_name}`,
  email: u.email,
  role: u.role,
  department: u.department?.id,
  department_name: u.department?.name,
});

export const getUsers = async () => {
  const res = await api.get("auth/users/");
  return normalizeList(getData(res)).map(adaptUser);
};

export const createUser = async (data) => {
  const res = await api.post("auth/users/", data);
  return getData(res);
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`auth/users/${id}/`, data);
  return getData(res);
};

export const deleteUser = async (id) => {
  await api.delete(`auth/users/${id}/`);
};
