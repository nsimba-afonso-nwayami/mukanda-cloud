import { useState, useEffect } from "react";
import GerenteLayout from "./components/GerenteLayout";
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

export default function EquipaGerente() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pegar o ID do gerente logado do localStorage (ajuste a chave 'user' se necessário)
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user"); // Ou a chave que usas no login
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUserId(parsed.id || parsed.pk); 
    }
  }, []);

  // Modais e Seleção
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // Form Create - Forçando o cargo como staff
  const { register, handleSubmit, reset, formState: { errors, isSubmitting: isCreating } } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: { role: "team_member" }
  });

  // Form Update
  const { register: registerEdit, handleSubmit: handleSubmitEdit, setValue, reset: resetEdit, formState: { errors: editErrors, isSubmitting: isEditing } } = useForm({
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
      // Força o cargo team_member no envio para a API
      await createUser({ ...data, role: "team_member" });
      toast.success("Membro da equipa criado!");
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
    setValue("role", "team_member"); 
    setEditModal(true);
  };

  const onUpdate = async (data) => {
    try {
      await updateUser(selected.id, { ...data, role: "team_member" });
      toast.success("Atualizado com sucesso!");
      setEditModal(false);
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

  const filteredItems = users.filter((u) => {
    const termo = searchTerm.toLowerCase();
    return (
      u.first_name.toLowerCase().includes(termo) ||
      u.last_name.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo)
    );
  });

  return (
    <>
      <title>Equipa | Mukanda Cloud</title>
      <GerenteLayout title="Gestão da Equipa">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
          <button 
            onClick={() => { reset(); setModalOpen(true); }} 
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <i className="fas fa-user-plus mr-2"></i> Novo Staff
          </button>

          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-blue-900 rounded-xl text-sm text-white focus:border-cyan-500 outline-none transition-all" 
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 min-h-[50vh]">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 italic">
              <i className="fas fa-sync animate-spin text-3xl mb-3 text-cyan-500"></i>
              Sincronizando...
            </div>
          ) : (
            filteredItems.map((u) => (
              <div
                key={u.id}
                onContextMenu={(e) => handleOpenContext(e, u)}
                onClick={() => setPreview(u)}
                className={`group bg-slate-900 border ${u.id === currentUserId ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/5' : 'border-blue-900/50'} rounded-2xl p-5 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/40 transition-all flex flex-col items-center text-center`}
              >
                <div className="w-16 h-16 rounded-full bg-blue-900/30 border border-blue-900 flex items-center justify-center text-2xl text-cyan-500 mb-3 group-hover:scale-110 transition-transform">
                  <i className={u.id === currentUserId ? "fas fa-user-shield text-amber-400" : "fas fa-user-circle"}></i>
                </div>
                <p className="text-sm text-white font-bold truncate w-full mb-1">
                  {u.first_name} {u.last_name} {u.id === currentUserId && "(Eu)"}
                </p>
                <p className="text-[10px] text-slate-400 truncate w-full mb-2 italic">{u.email}</p>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-blue-900 text-[9px] text-cyan-400 font-bold uppercase">
                  {u.role === "dept_manager" ? "Gerente" : "Staff"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Context Menu com Proteção de Auto-Edição */}
        {contextMenu && (
          <div className="fixed z-9999 bg-slate-900 border border-blue-900 rounded-xl w-48 shadow-2xl py-1" style={{ top: contextMenu.y, left: contextMenu.x }}>
            <div className="px-4 py-2 text-[10px] text-slate-500 border-b border-blue-900/50 truncate font-black uppercase italic">
              {selected?.first_name} {selected?.id === currentUserId ? "(Protegido)" : ""}
            </div>
            
            <button onClick={() => setPreview(selected)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 transition-colors cursor-pointer font-bold">
              <i className="fas fa-eye text-xs"></i> Ver Perfil
            </button>

            {/* Só permite editar/eliminar se NÃO for o próprio gerente logado */}
            {selected?.id !== currentUserId && (
              <>
                <button onClick={() => openEdit(selected)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 transition-colors cursor-pointer font-bold">
                  <i className="fas fa-edit text-xs"></i> Editar Staff
                </button>
                <div className="h-px bg-blue-900/50 my-1"></div>
                <button onClick={() => setDeleteModal(true)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-500 text-red-400 hover:text-white flex items-center gap-3 transition-colors cursor-pointer font-bold">
                  <i className="fas fa-trash-alt text-xs"></i> Eliminar
                </button>
              </>
            )}
          </div>
        )}

        {/* Modal: Novo (Campo ROLE removido para o Gerente) */}
        <ModalSmall isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Staff" icon="fas fa-user-plus">
          <form onSubmit={handleSubmit(handleCreate)} className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input {...register("first_name")} placeholder="Nome" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
              <input {...register("last_name")} placeholder="Apelido" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            </div>
            <input {...register("email")} placeholder="Email Corporativo" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            <input type="password" {...register("password")} placeholder="Senha" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            <select {...register("department")} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500">
              <option value="">Selecionar Departamento</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <p className="text-[10px] text-slate-500 italic text-center">* Novos cadastros serão definidos como Staff automaticamente.</p>
            <button type="submit" disabled={isCreating} className="mt-2 py-3.5 bg-cyan-500 text-slate-900 font-black rounded-xl uppercase text-xs tracking-widest cursor-pointer">
              {isCreating ? "Processando..." : "Registar Staff"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: Editar (Role fixo no envio) */}
        <ModalSmall isOpen={editModal} onClose={() => setEditModal(false)} title="Editar Staff" icon="fas fa-user-edit">
          <form onSubmit={handleSubmitEdit(onUpdate)} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input {...registerEdit("first_name")} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
              <input {...registerEdit("last_name")} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            </div>
            <input {...registerEdit("email")} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500" />
            <select {...registerEdit("department")} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500">
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button type="submit" disabled={isEditing} className="mt-2 py-3.5 bg-cyan-500 text-slate-900 font-black rounded-xl uppercase text-xs tracking-widest cursor-pointer">
              {isEditing ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: Eliminar */}
        <ModalSmall isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Remover da Equipa" icon="fas fa-trash-alt">
          <div className="text-center px-4">
            <p className="text-slate-400 text-sm mb-6 italic">Eliminar o acesso de <span className="text-white font-bold block not-italic mt-1">"{selected?.first_name} {selected?.last_name}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold border border-blue-900 cursor-pointer">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-red-500/20">Eliminar</button>
            </div>
          </div>
        </ModalSmall>

        {/* Modal: Preview */}
        <ModalSmall isOpen={!!preview} onClose={() => setPreview(null)} title="Ficha Técnica" icon="fas fa-id-card">
          {preview && (
            <div className="flex flex-col items-center gap-4 py-2">
               <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl text-cyan-500 shadow-inner">
                <i className={preview.id === currentUserId ? "fas fa-user-shield text-amber-400" : "fas fa-user-circle"}></i>
              </div>
              <div className="text-center w-full space-y-4">
                <h3 className="text-white font-bold text-xl">{preview.first_name} {preview.last_name}</h3>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-blue-900/30 text-left space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Email</span>
                    <span className="text-slate-200">{preview.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Cargo</span>
                    <span className="text-cyan-400 font-black uppercase">{preview.role === "dept_manager" ? "Gerente" : "Staff"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Departamento</span>
                    <span className="text-slate-200">{preview.department_name || "Geral"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalSmall>

      </GerenteLayout>
    </>
  );
}