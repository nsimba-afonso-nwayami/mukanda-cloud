import { useState, useEffect } from "react";
import GerenteLayout from "./components/GerenteLayout";
import ModalSmall from "./components/ModalSmall";
import toast from "react-hot-toast";

// Services
import { 
  getNodes, 
  getPermissions, 
  createPermission, 
  deletePermission 
} from "../../services/fileService";
import { getUsers } from "../../services/userService";

export default function PermissoesGerente() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  // Carregar dados iniciais e Identificar Utilizador Logado
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Recuperar utilizador do localStorage (ou seu Context de Auth)
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(storedUser);

      // 2. Buscar dados da API
      const [usersData, nodesData, permsData] = await Promise.all([
        getUsers(),
        getNodes({ node_type: "folder" }),
        getPermissions()
      ]);

      setUsuarios(usersData);
      setPastas(nodesData);
      setListaPermissoes(permsData);
    } catch (error) {
      toast.error("Erro ao sincronizar dados de acesso");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helpers de exibição
  const getUserName = (userId) => {
    const user = usuarios.find(u => String(u.id) === String(userId));
    return user ? `${user.first_name} ${user.last_name}` : "Utilizador";
  };

  const getFolderName = (nodeId) => {
    const folder = pastas.find(p => String(p.id) === String(nodeId));
    return folder ? folder.name : "Pasta";
  };

  const togglePermissao = (key) => {
    setPermissoes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSalvar = async () => {
    if (!selectedUser || !selectedFolder) {
      return toast.error("Selecione utilizador e pasta");
    }

    setIsSaving(true);
    try {
      await createPermission({
        userId: selectedUser,
        nodeId: selectedFolder,
        perms: permissoes
      });

      toast.success("Permissão atribuída com sucesso!");
      
      setSelectedUser("");
      setSelectedFolder("");
      setPermissoes({ ler: true, escrever: false, executar: false, apagar: false });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Falha ao salvar permissão");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePermission(id);
      toast.success("Acesso revogado");
      setListaPermissoes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast.error("Erro ao remover permissão");
    }
  };

  return (
    <>
      <title>Permissões | Mukanda Cloud</title>

      <GerenteLayout title="Gestão de Acessos">
        
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
          <p className="text-slate-400 text-sm">Controle quem pode visualizar ou editar pastas no sistema.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Nova Atribuição
          </button>
        </div>

        <div className="bg-slate-900 border border-blue-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-blue-900/50 bg-slate-900/50 flex items-center justify-between">
            <h2 className="text-xs font-black text-cyan-500 uppercase tracking-widest">Regras de Acesso Ativas</h2>
            <span className="text-[10px] text-slate-600 font-mono">ACL_ENGINE_V3</span>
          </div>

          <div className="p-4 min-h-75">
            {loading ? (
              <div className="py-20 text-center text-slate-500">
                <i className="fas fa-circle-notch animate-spin text-2xl text-cyan-500 mb-2"></i>
                <p className="text-xs italic tracking-widest">Sincronizando base de dados...</p>
              </div>
            ) : listaPermissoes.length === 0 ? (
              <div className="py-20 text-center text-slate-600 italic">Nenhuma regra personalizada definida.</div>
            ) : (
              <div className="grid gap-3">
                {listaPermissoes.map((item) => {
                  // BLOQUEIO: Verifica se a permissão pertence ao gerente logado
                  const isMyPermission = String(item.user) === String(currentUser?.id);

                  return (
                    <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/30 border rounded-xl p-4 transition-all gap-4 ${isMyPermission ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-blue-900/30 hover:border-blue-900/60'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-inner ${isMyPermission ? 'bg-cyan-500 text-slate-900' : 'bg-blue-900/30 text-cyan-500'}`}>
                          <i className={`fas ${isMyPermission ? 'fa-user-check' : 'fa-user-lock'}`}></i>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm flex-wrap">
                            <span className="text-white font-bold">{getUserName(item.user)}</span>
                            {isMyPermission && <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30 uppercase font-black">Tu</span>}
                            <i className="fas fa-arrow-right text-[10px] text-slate-600"></i>
                            <span className="text-cyan-400 font-medium italic">{getFolderName(item.node)}</span>
                          </div>
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                             {Object.entries(item.parsed || {}).map(([key, active]) => active && (
                               <span key={key} className="text-[8px] px-2 py-0.5 rounded bg-slate-900 border border-blue-900 text-slate-500 uppercase font-black tracking-tighter">
                                 {key}
                               </span>
                             ))}
                          </div>
                        </div>
                      </div>

                      {/* Lógica Condicional: Se for minha permissão, bloqueia a remoção */}
                      {isMyPermission ? (
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase italic px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                          <i className="fas fa-lock text-[8px]"></i>
                          Gerido pelo Admin
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-4 py-2 text-xs bg-slate-900/50 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg transition-all font-bold cursor-pointer"
                        >
                          Revogar Acesso
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <ModalSmall isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Regra de Acesso" icon="fas fa-shield-alt">
          <div className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 uppercase font-black ml-1 tracking-widest">Colaborador</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-3.5 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500 transition-all shadow-inner"
              >
                <option value="">Selecionar da lista...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 uppercase font-black ml-1 tracking-widest">Diretório / Pasta</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full p-3.5 bg-slate-800 border border-blue-900 text-white rounded-xl outline-none focus:border-cyan-500 transition-all shadow-inner"
              >
                <option value="">Selecionar diretório...</option>
                {pastas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-900/50 shadow-inner">
              <p className="text-[10px] text-slate-500 uppercase font-black mb-4 tracking-widest">Privilégios da Regra</p>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(permissoes).map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={permissoes[key]}
                      onChange={() => togglePermissao(key)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${permissoes[key] ? 'bg-cyan-500 border-cyan-500 shadow-md shadow-cyan-500/20' : 'border-blue-900 bg-slate-800 group-hover:border-slate-600'}`}>
                      {permissoes[key] && <i className="fas fa-check text-[10px] text-slate-900"></i>}
                    </div>
                    <span className={`text-xs uppercase font-bold tracking-tight transition-colors ${permissoes[key] ? 'text-white' : 'text-slate-500'}`}>
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSalvar}
              disabled={isSaving}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black rounded-xl transition-all disabled:opacity-50 uppercase text-xs tracking-widest shadow-xl shadow-cyan-500/20 cursor-pointer active:scale-[0.98]"
            >
              {isSaving ? "Gravando Regras..." : "Confirmar Permissões"}
            </button>
          </div>
        </ModalSmall>
      </GerenteLayout>
    </>
  );
}