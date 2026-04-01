import { useState, useEffect } from "react";

import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { userSchema } from "../../validations/userSchema";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../services/userService";

import { getDepartments } from "../../services/departmentService";

export default function EquipaSuperAdmin() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [context, setContext] = useState(null);

  /**
   * =========================
   * FORM CREATE
   * =========================
   */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  /**
   * =========================
   * FORM UPDATE
   * =========================
   */
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isEditing },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  /**
   * =========================
   * LOAD DATA
   * =========================
   */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, d] = await Promise.all([
        getUsers(),
        getDepartments(),
      ]);

      setUsers(u);
      setDepartments(d);
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  /**
   * =========================
   * CREATE USER
   * =========================
   */
  const onSubmit = async (data) => {
    try {
      await createUser(data);

      toast.success("Usuário criado com sucesso!");
      reset();
      setModalOpen(false);
      loadData();
    } catch {
      toast.error("Erro ao criar usuário");
    }
  };

  /**
   * =========================
   * OPEN EDIT MODAL
   * =========================
   */
  const openEdit = (user) => {
    setSelected(user);

    setValue("first_name", user.first_name || "");
    setValue("last_name", user.last_name || "");
    setValue("email", user.email || "");
    setValue("department", user.department || "");
    setValue("role", user.role || "");

    setEditModal(true);
    setContext(null);
  };

  /**
   * =========================
   * UPDATE USER
   * =========================
   */
  const onUpdate = async (data) => {
    try {
      await updateUser(selected.id, data);

      toast.success("Usuário atualizado com sucesso!");
      setEditModal(false);
      resetEdit();
      loadData();
    } catch {
      toast.error("Erro ao atualizar usuário");
    }
  };

  /**
   * =========================
   * DELETE USER
   * =========================
   */
  const handleDelete = async () => {
    try {
      await deleteUser(selected.id);

      toast.success("Usuário removido");
      setContext(null);
      loadData();
    } catch {
      toast.error("Erro ao remover usuário");
    }
  };

  /**
   * =========================
   * CONTEXT MENU
   * =========================
   */
  const openContext = (e, user) => {
    e.preventDefault();
    setSelected(user);

    setContext({
      x: Math.min(e.pageX, window.innerWidth - 160),
      y: Math.min(e.pageY, window.innerHeight - 140),
    });
  };

  const closeContext = () => setContext(null);

  /**
   * =========================
   * CLOSE CONTEXT ON CLICK OUTSIDE
   * =========================
   */
  useEffect(() => {
    if (!context) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest(".context-menu")) {
        closeContext();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [context]);

  /**
   * =========================
   * ROLE LABEL
   * =========================
   */
  const roleLabel = (r) => {
    if (r === "dept_manager") return "Gerente";
    if (r === "team_member") return "Staff";
    return r;
  };

  /**
   * =========================
   * LOADING
   * =========================
   */
  if (loading) {
    return (
      <SuperAdminLayout title="Equipa">
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <i className="fas fa-spinner fa-spin text-3xl mb-3"></i>
          Carregando usuários...
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <>
      <title>Equipa | Mukanda Cloud</title>

      <SuperAdminLayout title="Equipa">

        {/* BOTÃO */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg"
          >
            <i className="fas fa-user-plus mr-2"></i>
            Novo Usuário
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              onContextMenu={(e) => openContext(e, u)}
              onClick={() => setPreview(u)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-4 cursor-pointer hover:border-cyan-500"
            >
              <p className="text-center text-slate-200 font-semibold">
                {u.first_name} {u.last_name}
              </p>

              <p className="text-center text-slate-400 text-xs">
                {u.email}
              </p>

              <p className="text-center text-slate-400 text-xs">
                {roleLabel(u.role)}
              </p>

              <p className="text-center text-slate-400 text-xs">
                {u.department_name}
              </p>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[40vh] text-slate-500">
            <i className="fas fa-users text-4xl mb-2"></i>
            Nenhum usuário encontrado
          </div>
        )}

        {/* CONTEXT MENU */}
        {context && (
          <div
            className="context-menu fixed bg-slate-900 border border-blue-900 rounded-lg w-40 z-50"
            style={{ top: context.y, left: context.x }}
          >
            <button
              onClick={() => setPreview(selected)}
              className="w-full text-left px-4 py-2 hover:bg-slate-800"
            >
              Preview
            </button>

            <button
              onClick={() => openEdit(selected)}
              className="w-full text-left px-4 py-2 hover:bg-slate-800"
            >
              Editar
            </button>

            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800"
            >
              Excluir
            </button>
          </div>
        )}

        {/* MODAL CREATE */}
        <ModalSmall
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Novo Usuário"
          icon="fas fa-user-plus"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <input
              {...register("first_name")}
              placeholder="Nome"
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-red-500 text-xs">{errors.first_name?.message}</p>

            <input
              {...register("last_name")}
              placeholder="Apelido"
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-red-500 text-xs">{errors.last_name?.message}</p>

            <input
              {...register("email")}
              placeholder="Email"
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-red-400 text-xs">{errors.email?.message}</p>

            <input
              type="password"
              {...register("password")}
              placeholder="Senha"
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-red-400 text-xs">{errors.password?.message}</p>

            <select
              {...register("department")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Departamento</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              {...register("role")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            >
              <option value="team_member">Staff</option>
              <option value="dept_manager">Gerente</option>
            </select>

            <button
              disabled={isSubmitting}
              className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg"
            >
              {isSubmitting ? "Criando..." : "Criar"}
            </button>
          </form>
        </ModalSmall>

        {/* MODAL EDIT */}
        <ModalSmall
          isOpen={editModal}
          onClose={() => setEditModal(false)}
          title="Editar Usuário"
          icon="fas fa-edit"
        >
          <form onSubmit={handleSubmitEdit(onUpdate)} className="flex flex-col gap-4">

            <input
              {...registerEdit("first_name")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />

            <input
              {...registerEdit("last_name")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />

            <input
              {...registerEdit("email")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />

            <select
              {...register("department")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Departamento</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              {...registerEdit("role")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            >
              <option value="team_member">Staff</option>
              <option value="dept_manager">Gerente</option>
            </select>

            <button
              disabled={isEditing}
              className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg"
            >
              {isEditing ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </ModalSmall>

        {/* PREVIEW */}
        <ModalSmall
          isOpen={!!preview}
          onClose={() => setPreview(null)}
          title="Preview"
          icon="fas fa-eye"
        >
          {preview && (
            <div className="flex flex-col gap-2 text-slate-300">
              <p><strong>Nome:</strong> {preview.first_name} {preview.last_name}</p>
              <p><strong>Email:</strong> {preview.email}</p>
              <p><strong>Role:</strong> {roleLabel(preview.role)}</p>
              <p><strong>Departamento:</strong> {preview.department_name}</p>
            </div>
          )}
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}

