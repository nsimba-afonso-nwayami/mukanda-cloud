import { useState, useEffect, useRef } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";
import toast from "react-hot-toast";

// Forms & Validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentSchema } from "../../validations/departmentSchema";

// Services
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";
import { getUsers } from "../../services/userService";

export default function DepartamentosSuperAdmin() {
  const [departamentos, setDepartamentos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modais e Seleção
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [previewDepartamento, setPreviewDepartamento] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const longPressTimer = useRef(null);

  // Form para Novo Departamento
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isCreating },
  } = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues: { nome: "" },
  });

  // Form para Renomear
  const {
    register: registerRename,
    handleSubmit: handleSubmitRename,
    setValue: setRenameValue,
    formState: { errors: renameErrors, isSubmitting: isRenaming },
  } = useForm({
    resolver: yupResolver(departmentSchema),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deps, listaUsuarios] = await Promise.all([
        getDepartments(),
        getUsers(),
      ]);
      setDepartamentos(deps);
      setUsers(listaUsuarios);
    } catch (err) {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getContagemPessoas = (deptId) => {
    return users.filter((u) => u.department === deptId || u.department_id === deptId).length;
  };

  const handleCreate = async (data) => {
    try {
      await createDepartment(data);
      toast.success("Departamento criado!");
      reset();
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Erro ao criar departamento");
    }
  };

  const handleRename = async (data) => {
    try {
      await updateDepartment(selectedDepartamento.id, data.nome);
      toast.success("Atualizado com sucesso!");
      setRenameModal(false);
      fetchData();
    } catch {
      toast.error("Erro ao renomear");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(selectedDepartamento.id);
      toast.success("Removido com sucesso!");
      setDeleteModal(false);
      fetchData();
    } catch {
      toast.error("Erro ao eliminar");
    }
  };

  // Menu de Contexto (Mouse e Touch)
  const handleOpenContext = (e, item) => {
    e.preventDefault();
    setSelectedDepartamento(item);
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const onTouchStart = (e, item) => {
    longPressTimer.current = setTimeout(() => {
      setSelectedDepartamento(item);
      const touch = e.touches[0];
      setContextMenu({ x: touch.pageX, y: touch.pageY });
    }, 700);
  };

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const filteredItems = departamentos.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <title>Departamentos | Mukanda Cloud</title>
      <SuperAdminLayout title="Gestão de Departamentos">

        {/* Toolbar Responsiva (Padronizada) */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
          <button 
            onClick={() => { reset(); setIsModalOpen(true); }} 
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition active:scale-95 shadow-lg shadow-cyan-500/10 flex items-center justify-center cursor-pointer"
          >
            <i className="fas fa-plus-circle mr-2"></i> Novo Departamento
          </button>

          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Pesquisar departamento..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-blue-900 rounded-xl text-sm text-white focus:border-cyan-500 outline-none transition-all" 
            />
          </div>
        </div>

        {/* Grid de Departamentos */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 min-h-[50vh]">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 italic">
              <i className="fas fa-sync animate-spin text-3xl mb-3 text-cyan-500"></i>
              Sincronizando departamentos...
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onContextMenu={(e) => handleOpenContext(e, item)}
                onTouchStart={(e) => onTouchStart(e, item)}
                onTouchEnd={() => clearTimeout(longPressTimer.current)}
                onDoubleClick={() => setPreviewDepartamento(item)}
                className="group bg-slate-900 border border-blue-900/50 rounded-2xl p-5 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/40 transition-all flex flex-col items-center justify-center aspect-square text-center shadow-xl shadow-black/20"
              >
                <div className="text-4xl mb-3 text-cyan-500 group-hover:scale-110 transition-transform">
                  <i className="fas fa-building"></i>
                </div>
                <p className="text-xs text-white font-bold truncate w-full px-1 mb-1">
                  {item.name}
                </p>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                  {getContagemPessoas(item.id)} Membros
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-600">
              <i className="fas fa-city text-5xl mb-4 opacity-10"></i>
              <p className="text-slate-400 font-medium italic">Nenhum departamento encontrado</p>
            </div>
          )}
        </div>

        {/* Menu de Contexto (Padronizado) */}
        {contextMenu && (
          <div 
            className="fixed z-9999 bg-slate-900 border border-blue-900 rounded-xl w-48 shadow-2xl py-1 animate-in fade-in zoom-in duration-100" 
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div className="px-4 py-2 text-[10px] text-slate-500 border-b border-blue-900/50 truncate font-black uppercase">
              {selectedDepartamento?.name}
            </div>
            <button onClick={() => { setPreviewDepartamento(selectedDepartamento); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 transition-colors">
              <i className="fas fa-eye text-xs"></i> Ver Detalhes
            </button>
            <div className="h-px bg-blue-900/50 my-1"></div>
            <button onClick={() => { setRenameValue("nome", selectedDepartamento.name); setRenameModal(true); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 transition-colors">
              <i className="fas fa-edit text-xs"></i> Renomear
            </button>
            <button onClick={() => setDeleteModal(true)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-500 text-red-400 hover:text-white flex items-center gap-3 transition-colors">
              <i className="fas fa-trash-alt text-xs"></i> Eliminar
            </button>
          </div>
        )}

        {/* Modal: CRIAR */}
        <ModalSmall isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Departamento" icon="fas fa-plus">
          <form onSubmit={handleSubmit(handleCreate)} className="flex flex-col gap-4">
            <div className="space-y-1">
              <input 
                {...register("nome")} 
                autoFocus 
                placeholder="Ex: Recursos Humanos" 
                className={`w-full p-3.5 bg-slate-800 border ${errors.nome ? 'border-red-500' : 'border-blue-900'} text-white rounded-xl outline-none focus:border-cyan-500 transition-all`} 
              />
              {errors.nome && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.nome.message}</span>}
            </div>
            <button type="submit" disabled={isCreating} className="w-full py-3.5 cursor-pointer bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-black rounded-xl transition">
              {isCreating ? <i className="fas fa-sync animate-spin mr-2"></i> : "Criar Departamento"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: RENOMEAR */}
        <ModalSmall isOpen={renameModal} onClose={() => setRenameModal(false)} title="Renomear" icon="fas fa-edit">
          <form onSubmit={handleSubmitRename(handleRename)} className="flex flex-col gap-4">
            <div className="space-y-1">
              <input 
                {...registerRename("nome")} 
                autoFocus 
                className={`w-full p-3.5 bg-slate-800 border ${renameErrors.nome ? 'border-red-500' : 'border-blue-900'} text-white rounded-xl outline-none focus:border-cyan-500 transition-all`} 
              />
              {renameErrors.nome && <span className="text-[10px] text-red-500 font-bold ml-1">{renameErrors.nome.message}</span>}
            </div>
            <button type="submit" disabled={isRenaming} className="w-full py-3.5 cursor-pointer bg-cyan-500 text-slate-900 font-black rounded-xl transition">
              {isRenaming ? <i className="fas fa-sync animate-spin mr-2"></i> : "Salvar Alteração"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: ELIMINAR */}
        <ModalSmall isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Atenção" icon="fas fa-exclamation-triangle">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-6 px-4">Tem certeza que deseja eliminar o departamento <span className="text-white font-bold block">"{selectedDepartamento?.name}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold border border-blue-900 hover:bg-slate-700 transition-all">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all">Eliminar</button>
            </div>
          </div>
        </ModalSmall>

        {/* Modal: DETALHES (Preview) */}
        <ModalSmall isOpen={!!previewDepartamento} onClose={() => setPreviewDepartamento(null)} title="Informações do Departamento" icon="fas fa-info-circle">
          {previewDepartamento && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl text-cyan-500">
                <i className="fas fa-building"></i>
              </div>
              <div className="text-center w-full space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Nome Oficial</label>
                  <p className="text-white font-bold text-lg">{previewDepartamento.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-blue-900/30">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Membros</label>
                    <p className="text-cyan-400 font-black text-xl">{getContagemPessoas(previewDepartamento.id)}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Status</label>
                    <p className="text-emerald-500 font-black text-sm uppercase">Ativo</p>
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