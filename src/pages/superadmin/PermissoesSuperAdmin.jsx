import { useState, useEffect } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";
import toast from "react-hot-toast";

// Services
import { 
  getNodes, 
  getPermissions, 
  createPermission, 
  deletePermission,
  parsePermissionMask 
} from "../../services/fileService";
import { getUsers } from "../../services/userService";

export default function PermissoesSuperAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Dados do Servidor
  const [usuarios, setUsuarios] = useState([]);
  const [pastas, setPastas] = useState([]);
  const [listaPermissoes, setListaPermissoes] = useState([]);

  // Seleção no Modal
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [permissoes, setPermissoes] = useState({
    ler: true,
    escrever: false,
    executar: false,
    apagar: false,
  });

  // Helpers para exibir nomes em vez de IDs
  const getUserName = (userId) => {
    const user = usuarios.find(u => String(u.id) === String(userId));
    return user ? `${user.first_name} ${user.last_name}` : "Usuário desconhecido";
  };

  const getFolderName = (nodeId) => {
    const folder = pastas.find(p => String(p.id) === String(nodeId));
    return folder ? folder.name : "Pasta desconhecida";
  };

  // Carregar dados iniciais
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, nodesData, permsData] = await Promise.all([
        getUsers(),
        getNodes({ node_type: "folder" }),
        getPermissions()
      ]);

      setUsuarios(usersData);
      setPastas(nodesData);
      setListaPermissoes(permsData);
    } catch (error) {
      toast.error("Erro ao sincronizar dados de permissões");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePermissao = (key) => {
    setPermissoes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSalvar = async () => {
    if (!selectedUser || !selectedFolder) {
      return toast.error("Selecione um usuário e uma pasta");
    }

    setIsSaving(true);
    try {
      await createPermission({
        userId: selectedUser,
        nodeId: selectedFolder,
        perms: permissoes
      });

      toast.success("Permissão atribuída!");
      
      setSelectedUser("");
      setSelectedFolder("");
      setPermissoes({ ler: true, escrever: false, executar: false, apagar: false });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Erro ao salvar permissão";
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePermission(id);
      toast.success("Permissão revogada");
      setListaPermissoes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast.error("Erro ao remover permissão");
    }
  };

  return (
    <>
      <title>Permissões | Mukanda Cloud</title>
      <SuperAdminLayout title="Gestão de Acessos (ACL)">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <p className="text-slate-400 text-sm">
            Controle de acesso individual por utilizador e diretório.
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <i className="fas fa-plus-circle mr-2"></i> 
            Nova Atribuição
          </button>
        </div>

        <div className="bg-slate-900 border border-blue-900 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-blue-900/50 bg-slate-900/50">
             <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Lista de Controlo de Acesso</h2>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="py-10 text-center text-slate-500 italic">
                <i className="fas fa-sync animate-spin mr-2"></i> Carregando permissões...
              </div>
            ) : listaPermissoes.length === 0 ? (
              <div className="py-10 text-center text-slate-600 italic">Nenhuma permissão personalizada configurada.</div>
            ) : (
              <div className="grid gap-3">
                {listaPermissoes.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-800/50 border border-blue-900/30 rounded-lg p-4 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-cyan-500">
                        <i className="fas fa-user-shield text-sm"></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          {/* Exibindo Nomes em vez de IDs */}
                          <span className="text-white font-bold">{getUserName(item.user)}</span>
                          <i className="fas fa-arrow-right text-[10px] text-slate-600"></i>
                          <span className="text-cyan-400 font-medium">{getFolderName(item.node)}</span>
                        </div>
                        <div className="flex gap-2 mt-1">
                           {Object.entries(item.parsed).map(([key, active]) => active && (
                             <span key={key} className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-blue-900 text-slate-400 uppercase font-semibold">
                               {key}
                             </span>
                           ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                      title="Revogar Acesso"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MODAL DE ATRIBUIÇÃO */}
        <ModalSmall
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Atribuir Acesso"
          icon="fas fa-shield-alt"
        >
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase ml-1">Utilizador</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg outline-none focus:border-cyan-500"
              >
                <option value="">Selecione o utilizador...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase ml-1">Diretório / Pasta</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg outline-none focus:border-cyan-500"
              >
                <option value="">Selecione a pasta...</option>
                {pastas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900/50 border border-blue-900/50 rounded-lg p-4 mt-2">
              <p className="text-[10px] text-slate-500 uppercase mb-4 tracking-tighter font-bold">Níveis de Permissão</p>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(permissoes).map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={permissoes[key]}
                        onChange={() => togglePermissao(key)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border rounded transition-colors flex items-center justify-center ${permissoes[key] ? 'bg-cyan-500 border-cyan-500' : 'border-blue-900 bg-slate-800'}`}>
                        {permissoes[key] && <i className="fas fa-check text-[10px] text-slate-900"></i>}
                      </div>
                    </div>
                    <span className={`text-sm capitalize transition-colors ${permissoes[key] ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSalvar}
              disabled={isSaving}
              className="w-full cursor-pointer mt-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition disabled:opacity-50"
            >
              {isSaving ? <i className="fas fa-sync animate-spin mr-2"></i> : "Confirmar Acesso"}
            </button>
          </div>
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}