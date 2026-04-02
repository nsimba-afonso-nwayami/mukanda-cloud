import { useState, useEffect } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

// Importando os dois schemas
import { userSchema, userUpdateSchema } from "../../validations/userSchema";
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

  // Estados para Pesquisa e Paginação
  const [pesquisa, setPesquisa] = useState("");
  const [verMais, setVerMais] = useState(false);
  const LIMIT = 10;

  /**
   * FORM CREATE
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
   * FORM UPDATE
   */
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isEditing },
  } = useForm({
    resolver: yupResolver(userUpdateSchema),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, d] = await Promise.all([getUsers(), getDepartments()]);
      setUsers(u);
      setDepartments(d);
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  /**
   * LÓGICA DE FILTRO E PESQUISA
   */
  const filtrados = users.filter((u) => {
    const termo = pesquisa.toLowerCase();
    return (
      u.first_name.toLowerCase().includes(termo) ||
      u.last_name.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo) ||
      (u.department_name && u.department_name.toLowerCase().includes(termo))
    );
  });

  const lista = verMais ? filtrados : filtrados.slice(0, LIMIT);

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

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await deleteUser(selected.id);
      toast.success("Usuário removido");
      setContext(null);
      loadData();
    } catch {
      toast.error("Erro ao remover usuário");
    }
  };

  const openContext = (e, user) => {
    e.preventDefault();
    setSelected(user);
    setContext({
      x: Math.min(e.pageX, window.innerWidth - 160),
      y: Math.min(e.pageY, window.innerHeight - 140),
    });
  };

  const closeContext = () => setContext(null);

  useEffect(() => {
    if (!context) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".context-menu")) closeContext();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [context]);

  const roleLabel = (r) => {
    if (r === "dept_manager") return "Gerente";
    if (r === "team_member") return "Staff";
    return r;
  };

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
        
        {/* BOTÃO NOVO USUÁRIO */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            <i className="fas fa-user-plus mr-2"></i>
            Novo Usuário
          </button>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou departamento..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none w-full"
          />
        </div>

        {/* LISTAGEM (GRID) */}
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] text-slate-500">
            <i className="fas fa-users text-4xl mb-2"></i>
            {pesquisa ? "Nenhum resultado encontrado" : "Nenhum usuário cadastrado"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lista.map((u) => (
                <div
                  key={u.id}
                  onContextMenu={(e) => openContext(e, u)}
                  onClick={() => setPreview(u)}
                  className="bg-slate-900 border border-blue-900 rounded-xl p-4 cursor-pointer hover:border-cyan-500 transition-all"
                >
                  <p className="text-center text-slate-200 font-semibold">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-center text-slate-400 text-xs">{u.email}</p>
                  <p className="text-center text-slate-400 text-xs">{roleLabel(u.role)}</p>
                  <p className="text-center text-slate-400 text-xs">{u.department_name}</p>
                </div>
              ))}
            </div>

            {/* BOTÃO VER MAIS */}
            {filtrados.length > LIMIT && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVerMais(!verMais)}
                  className="px-6 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 cursor-pointer transition-colors"
                >
                  {verMais ? "Ver Menos" : "Ver Mais"}
                </button>
              </div>
            )}
          </>
        )}

        {/* CONTEXT MENU */}
        {context && (
          <div
            className="context-menu fixed bg-slate-900 border border-blue-900 rounded-lg w-40 z-50 shadow-2xl overflow-hidden"
            style={{ top: context.y, left: context.x }}
          >
            <button onClick={() => { setPreview(selected); closeContext(); }} className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300">Preview</button>
            <button onClick={() => openEdit(selected)} className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300">Editar</button>
            <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800">Excluir</button>
          </div>
        )}

        {/* MODAL CREATE */}
        <ModalSmall isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Usuário" icon="fas fa-user-plus">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input {...register("first_name")} placeholder="Nome" className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
            </div>

            <div>
              <input {...register("last_name")} placeholder="Apelido" className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
            </div>

            <div>
              <input {...register("email")} placeholder="Email" className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input type="password" {...register("password")} placeholder="Senha" className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <select {...register("department")} className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none">
                <option value="">Departamento</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
            </div>

            <select {...register("role")} className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none">
              <option value="team_member">Staff</option>
              <option value="dept_manager">Gerente</option>
            </select>

            <button disabled={isSubmitting} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg disabled:opacity-50">
              {isSubmitting ? "Criando..." : "Criar"}
            </button>
          </form>
        </ModalSmall>

        {/* MODAL EDIT */}
        <ModalSmall isOpen={editModal} onClose={() => setEditModal(false)} title="Editar Usuário" icon="fas fa-edit">
          <form onSubmit={handleSubmitEdit(onUpdate)} className="flex flex-col gap-4">
            <div>
              <input {...registerEdit("first_name")} className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
              {editErrors.first_name && <p className="text-red-400 text-xs mt-1">{editErrors.first_name.message}</p>}
            </div>

            <div>
              <input {...registerEdit("last_name")} className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
              {editErrors.last_name && <p className="text-red-400 text-xs mt-1">{editErrors.last_name.message}</p>}
            </div>

            <div>
              <input {...registerEdit("email")} className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
              {editErrors.email && <p className="text-red-400 text-xs mt-1">{editErrors.email.message}</p>}
            </div>

            <div>
              <select {...registerEdit("department")} className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none">
                <option value="">Departamento</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {editErrors.department && <p className="text-red-400 text-xs mt-1">{editErrors.department.message}</p>}
            </div>

            <div>
              <select {...registerEdit("role")} className="w-full p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none">
                <option value="team_member">Staff</option>
                <option value="dept_manager">Gerente</option>
              </select>
              {editErrors.role && <p className="text-red-400 text-xs mt-1">{editErrors.role.message}</p>}
            </div>

            <button disabled={isEditing} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg disabled:opacity-50">
              {isEditing ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </ModalSmall>

        {/* PREVIEW */}
        <ModalSmall isOpen={!!preview} onClose={() => setPreview(null)} title="Preview" icon="fas fa-eye">
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