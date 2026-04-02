import { useState, useEffect } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { departmentSchema } from "../../validations/departmentSchema";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";
import { getUsers } from "../../services/userService"; // Importado para contar pessoas

export default function DepartamentosSuperAdmin() {
  const [departamentos, setDepartamentos] = useState([]);
  const [users, setUsers] = useState([]); // Estado para usuários
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [previewDepartamento, setPreviewDepartamento] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);

  const [pesquisa, setPesquisa] = useState("");
  const [verMais, setVerMais] = useState(false);

  const LIMIT = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues: { nome: "" },
  });

  const {
    register: registerRename,
    handleSubmit: handleSubmitRename,
    setValue: setRenameValue,
    formState: { errors: renameErrors, isSubmitting: isRenaming },
  } = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues: { nome: "" },
  });

  /**
   * FETCH DATA (Departamentos + Usuários para contagem)
   */
  const fetchData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * FUNÇÃO PARA CONTAR PESSOAS POR DEPARTAMENTO
   */
  const getContagemPessoas = (deptId) => {
    return users.filter((u) => u.department === deptId || u.department_id === deptId).length;
  };

  const onSubmit = async (data) => {
    try {
      await createDepartment(data);
      toast.success("Departamento criado");
      reset();
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Erro ao criar departamento");
    }
  };

  const onRename = async (data) => {
    try {
      await updateDepartment(selectedDepartamento.id, data.nome);
      toast.success("Departamento atualizado");
      setRenameModal(false);
      fetchData();
    } catch {
      toast.error("Erro ao renomear");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(selectedDepartamento.id);
      toast.success("Departamento removido");
      setDeleteModal(false);
      fetchData();
    } catch {
      toast.error("Erro ao deletar");
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setSelectedDepartamento(item);
    const x = Math.min(e.pageX, window.innerWidth - 150);
    const y = Math.min(e.pageY, window.innerHeight - 120);
    setContextMenu({ x, y });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".context-menu")) closeContextMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  const filtrados = departamentos.filter((d) =>
    d.name.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const lista = verMais ? filtrados : filtrados.slice(0, LIMIT);

  if (loading) {
    return (
      <SuperAdminLayout title="Departamentos">
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <i className="fas fa-spinner fa-spin text-3xl mb-3"></i>
          Carregando departamentos...
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <>
      <title>Departamentos | Mukanda Cloud</title>
      <SuperAdminLayout title="Departamentos">
        
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg font-semibold cursor-pointer"
          >
            <i className="fas fa-plus mr-2"></i>
            Novo Departamento
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar departamento..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none w-full"
          />
        </div>

        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 mt-10">
            <i className="fas fa-building text-4xl mb-3"></i>
            Nenhum departamento encontrado
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {lista.map((dep) => (
                <div
                  key={dep.id}
                  onContextMenu={(e) => handleContextMenu(e, dep)}
                  onDoubleClick={() => setPreviewDepartamento(dep)}
                  className="bg-slate-900 border border-blue-900 rounded-xl p-4 cursor-pointer hover:border-cyan-500 flex flex-col items-center transition-all"
                >
                  <i className="fas fa-building text-3xl text-cyan-500 mb-2"></i>
                  <p className="text-sm text-slate-300 truncate w-full text-center font-medium">
                    {dep.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Pessoas: {getContagemPessoas(dep.id)}
                  </p>
                </div>
              ))}
            </div>

            {filtrados.length > LIMIT && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setVerMais(!verMais)}
                  className="px-6 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 cursor-pointer"
                >
                  {verMais ? "Ver Menos" : "Ver Mais"}
                </button>
              </div>
            )}
          </>
        )}

        {/* CONTEXT MENU */}
        {contextMenu && (
          <div
            className="context-menu fixed z-50 bg-slate-900 border border-blue-900 rounded-lg w-40 shadow-lg overflow-hidden"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button onClick={() => { setPreviewDepartamento(selectedDepartamento); closeContextMenu(); }} className="block px-4 py-2 hover:bg-slate-800 w-full text-left text-slate-300">Preview</button>
            <button onClick={() => { setRenameValue("nome", selectedDepartamento.name); setRenameModal(true); closeContextMenu(); }} className="block px-4 py-2 hover:bg-slate-800 w-full text-left text-slate-300">Renomear</button>
            <button onClick={() => { setDeleteModal(true); closeContextMenu(); }} className="block px-4 py-2 text-red-400 hover:bg-slate-800 w-full text-left">Deletar</button>
          </div>
        )}

        {/* MODAL CRIAR */}
        <ModalSmall isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Departamento" icon="fas fa-plus">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input {...register("nome")} placeholder="Nome do departamento" className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
            {errors.nome && <p className="text-red-500 text-xs">{errors.nome.message}</p>}
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg disabled:opacity-50">
              {isSubmitting ? "Criando..." : "Criar"}
            </button>
          </form>
        </ModalSmall>

        {/* MODAL RENOMEAR */}
        <ModalSmall isOpen={renameModal} onClose={() => setRenameModal(false)} title="Renomear Departamento" icon="fas fa-edit">
          <form onSubmit={handleSubmitRename(onRename)} className="flex flex-col gap-4">
            <input {...registerRename("nome")} className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none" />
            {renameErrors.nome && <p className="text-red-500 text-xs">{renameErrors.nome.message}</p>}
            <button type="submit" disabled={isRenaming} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg disabled:opacity-50">
              {isRenaming ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </ModalSmall>

        {/* DELETE */}
        <ModalSmall isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirmar Exclusão" icon="fas fa-trash">
          <p className="text-slate-300 mb-4 text-center">Deseja realmente excluir o departamento <strong>{selectedDepartamento?.name}</strong>?</p>
          <button onClick={handleDelete} className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
            Confirmar Exclusão
          </button>
        </ModalSmall>

        {/* PREVIEW */}
        <ModalSmall isOpen={!!previewDepartamento} onClose={() => setPreviewDepartamento(null)} title="Detalhes" icon="fas fa-eye">
          {previewDepartamento && (
            <div className="flex flex-col gap-2 text-slate-300">
              <p><strong>Nome:</strong> {previewDepartamento.name}</p>
              <p><strong>Total de Pessoas:</strong> {getContagemPessoas(previewDepartamento.id)}</p>
            </div>
          )}
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}