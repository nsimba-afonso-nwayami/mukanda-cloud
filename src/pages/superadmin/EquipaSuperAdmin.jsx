import { useState, useEffect, useRef } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";
import toast from "react-hot-toast";

// Forms & Validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema, userUpdateSchema } from "../../validations/userSchema";

// Services
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
  const [searchTerm, setSearchTerm] = useState("");

  // Modais e Seleção
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const longPressTimer = useRef(null);

  // Form Create
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isCreating },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  // Form Update
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isEditing },
  } = useForm({
    resolver: yupResolver(userUpdateSchema),
  });

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

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (data) => {
    try {
      await createUser(data);
      toast.success("Utilizador criado!");
      reset();
      setModalOpen(false);
      loadData();
    } catch {
      toast.error("Erro ao criar utilizador");
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
  };

  const onUpdate = async (data) => {
    try {
      await updateUser(selected.id, data);
      toast.success("Atualizado com sucesso!");
      setEditModal(false);
      resetEdit();
      loadData();
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selected.id);
      toast.success("Utilizador removido");
      setDeleteModal(false);
      loadData();
    } catch {
      toast.error("Erro ao remover");
    }
  };

  // Handlers de Context Menu
  const handleOpenContext = (e, user) => {
    e.preventDefault();
    setSelected(user);
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const roleLabel = (r) => {
    if (r === "dept_manager") return "Gerente";
    if (r === "team_member") return "Staff";
    return r;
  };

  const filteredItems = users.filter((u) => {
    const termo = searchTerm.toLowerCase();
    return (
      u.first_name.toLowerCase().includes(termo) ||
      u.last_name.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo) ||
      (u.department_name && u.department_name.toLowerCase().includes(termo))
    );
  });

  return (
    <>
      <title>Equipa | Mukanda Cloud</title>
      <SuperAdminLayout title="Gestão da Equipa">

        {/* Toolbar Responsiva */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
          <button 
            onClick={() => { reset(); setModalOpen(true); }} 
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <i className="fas fa-user-plus mr-2"></i> Novo Utilizador
          </button>

          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Pesquisar equipa..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-blue-900 rounded-xl text-sm text-white focus:border-cyan-500 outline-none transition-all" 
            />
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 min-h-[50vh]">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 italic">
              <i className="fas fa-sync animate-spin text-3xl mb-3 text-cyan-500"></i>
              Sincronizando membros...
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((u) => (
              <div
                key={u.id}
                onContextMenu={(e) => handleOpenContext(e, u)}
                onClick={() => setPreview(u)}
                className="group bg-slate-900 border border-blue-900/50 rounded-2xl p-5 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/40 transition-all flex flex-col items-center text-center shadow-xl shadow-black/20"
              >
                <div className="w-16 h-16 rounded-full bg-blue-900/30 border border-blue-900 flex items-center justify-center text-2xl text-cyan-500 mb-3 group-hover:scale-110 transition-transform">
                  <i className="fas fa-user-circle"></i>
                </div>
                <p className="text-sm text-white font-bold truncate w-full mb-1">
                  {u.first_name} {u.last_name}
                </p>
                <p className="text-[10px] text-slate-400 truncate w-full mb-2 italic">{u.email}</p>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-blue-900 text-[9px] text-cyan-400 font-bold uppercase tracking-wider">
                  {roleLabel(u.role)}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-600">
              <i className="fas fa-users-slash text-5xl mb-4 opacity-10"></i>
              <p className="text-slate-400 font-medium italic">Nenhum membro encontrado</p>
            </div>
          )}
        </div>

        {/* Context Menu Padronizado */}
        {contextMenu && (
          <div 
            className="fixed z-9999 bg-slate-900 border border-blue-900 rounded-xl w-48 shadow-2xl py-1" 
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div className="px-4 py-2 text-[10px] text-slate-500 border-b border-blue-900/50 truncate font-black uppercase">
              {selected?.first_name} {selected?.last_name}
            </div>
            <button onClick={() => setPreview(selected)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 transition-colors">
              <i className="fas fa-eye text-xs"></i> Ver Perfil
            </button>
            <button onClick={() => openEdit(selected)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 transition-colors">
              <i className="fas fa-edit text-xs"></i> Editar
            </button>
            <div className="h-px bg-blue-900/50 my-1"></div>
            <button onClick={() => setDeleteModal(true)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-500 text-red-400 hover:text-white flex items-center gap-3 transition-colors">
              <i className="fas fa-trash-alt text-xs"></i> Eliminar
            </button>
          </div>
        )}

        {/* Modal: NOVO */}
        <ModalSmall isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Utilizador" icon="fas fa-user-plus">
          <form onSubmit={handleSubmit(handleCreate)} className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input {...register("first_name")} placeholder="Nome" className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
              <input {...register("last_name")} placeholder="Apelido" className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            </div>
            <input {...register("email")} placeholder="Email Corporativo" className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            <input type="password" {...register("password")} placeholder="Senha de Acesso" className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            
            <div className="grid grid-cols-2 gap-3">
              <select {...register("department")} className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500">
                <option value="">Departamento</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select {...register("role")} className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500">
                <option value="team_member">Staff</option>
                <option value="dept_manager">Gerente</option>
              </select>
            </div>
            
            <button type="submit" disabled={isCreating} className="mt-2 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black rounded-xl transition disabled:opacity-50 uppercase text-xs tracking-widest">
              {isCreating ? "Processando..." : "Criar Utilizador"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: EDITAR */}
        <ModalSmall isOpen={editModal} onClose={() => setEditModal(false)} title="Editar Membro" icon="fas fa-user-edit">
          <form onSubmit={handleSubmitEdit(onUpdate)} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input {...registerEdit("first_name")} className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
              <input {...registerEdit("last_name")} className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            </div>
            <input {...registerEdit("email")} className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            
            <div className="grid grid-cols-2 gap-3">
              <select {...registerEdit("department")} className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500">
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select {...registerEdit("role")} className="p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500">
                <option value="team_member">Staff</option>
                <option value="dept_manager">Gerente</option>
              </select>
            </div>
            <button type="submit" disabled={isEditing} className="mt-2 py-3.5 bg-cyan-500 text-slate-900 font-black rounded-xl transition uppercase text-xs tracking-widest">
              {isEditing ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: ELIMINAR */}
        <ModalSmall isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Remover da Equipa" icon="fas fa-trash-alt">
          <div className="text-center px-4">
            <p className="text-slate-400 text-sm mb-6">Remover o acesso de <span className="text-white font-bold block">"{selected?.first_name} {selected?.last_name}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold border border-blue-900 transition-all">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all">Eliminar</button>
            </div>
          </div>
        </ModalSmall>

        {/* Preview: PERFIL */}
        <ModalSmall isOpen={!!preview} onClose={() => setPreview(null)} title="Ficha do Utilizador" icon="fas fa-id-card">
          {preview && (
            <div className="flex flex-col items-center gap-4 py-2">
               <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl text-cyan-500">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="text-center w-full space-y-4">
                <h3 className="text-white font-bold text-xl">{preview.first_name} {preview.last_name}</h3>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-blue-900/30 text-left space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase">Email</span>
                    <span className="text-slate-200">{preview.email}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase">Cargo</span>
                    <span className="text-cyan-400 font-bold">{roleLabel(preview.role)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase">Departamento</span>
                    <span className="text-slate-200">{preview.department_name || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}