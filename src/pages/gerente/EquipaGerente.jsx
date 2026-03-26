import { useState, useRef, useEffect } from "react";
import GerenteLayout from "./components/GerenteLayout";
import ModalSmall from "./components/ModalSmall";

export default function EquipaGerente() {
  const [departamentos, setDepartamentos] = useState([
    { id: 1, nome: "Financeiro" },
    { id: 2, nome: "RH" },
    { id: 3, nome: "TI" },
  ]);

  const [equipa, setEquipa] = useState([
    { id: 1, nome: "João Silva", email: "joao@empresa.com", telefone: "912345678", departamento: "Financeiro", nivel: "Gerente", senha: "123456" },
    { id: 2, nome: "Maria Santos", email: "maria@empresa.com", telefone: "923456789", departamento: "RH", nivel: "Staff", senha: "abcdef" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [senhaModal, setSenhaModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "", email: "", telefone: "", senha: "", departamento: "", nivel: "Staff"
  });

  const [editUser, setEditUser] = useState({
    nome: "", email: "", telefone: "", departamento: "", nivel: ""
  });

  const [novaSenha, setNovaSenha] = useState("");

  // =============================
  // Ações principais
  // =============================
  const handleCriarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha || !novoUsuario.departamento) return;
    setEquipa([...equipa, { id: Date.now(), ...novoUsuario }]);
    setNovoUsuario({ nome: "", email: "", telefone: "", senha: "", departamento: "", nivel: "Staff" });
    setIsModalOpen(false);
  };

  const handleEditarUsuario = () => {
    setEquipa(prev =>
      prev.map(u => u.id === selectedUser.id ? { ...u, ...editUser } : u)
    );
    setEditModal(false);
  };

  const handleEditarSenha = () => {
    setEquipa(prev =>
      prev.map(u => u.id === selectedUser.id ? { ...u, senha: novaSenha } : u)
    );
    setSenhaModal(false);
  };

  const handleDelete = () => {
    setEquipa(prev => prev.filter(u => u.id !== selectedUser.id));
    setDeleteModal(false);
  };

  const handlePreview = (user) => {
    setPreviewUser(user);
    closeContextMenu();
  };

  // =============================
  // Context menu
  // =============================
  const handleContextMenu = (e, user) => {
    e.preventDefault();
    setSelectedUser(user);
    const x = Math.min(e.pageX, window.innerWidth - 150);
    const y = Math.min(e.pageY, window.innerHeight - 140);
    setContextMenu({ x, y });
  };
  const closeContextMenu = () => setContextMenu(null);

  // =============================
  // Mobile: toque longo
  // =============================
  const handleTouchStart = (user) => {
    const timer = setTimeout(() => {
      setSelectedUser(user);
      setContextMenu({ x: window.innerWidth / 2 - 80, y: window.innerHeight / 2 - 70 });
    }, 600);
    return timer;
  };
  const handleTouchEnd = (timer) => clearTimeout(timer);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".context-menu")) closeContextMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <>
      <title>Equipa | Mukanda Cloud</title>
      <GerenteLayout title="Equipa">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg font-semibold w-full sm:w-auto flex justify-center items-center cursor-pointer"
          >
            <i className="fas fa-user-plus mr-2"></i>
            Novo Usuário
          </button>
        </div>

        {/* Grid de usuários */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipa.map(user => (
            <div
              key={user.id}
              onContextMenu={(e) => handleContextMenu(e, user)}
              onTouchStart={() => (user.touchTimer = handleTouchStart(user))}
              onTouchEnd={() => handleTouchEnd(user.touchTimer)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-4 cursor-pointer hover:border-cyan-500 flex flex-col items-center"
            >
              <div className="flex justify-center mb-2">
                <i className={`fas fa-user text-3xl ${user.nivel === "Gerente" ? "text-yellow-400" : "text-green-400"}`}></i>
              </div>
              <p className="text-sm text-center text-slate-300 truncate w-full">{user.nome}</p>
              <p className="text-xs text-slate-400 text-center">{user.nivel}</p>
              <p className="text-xs text-slate-400 text-center">{user.departamento}</p>
              <p className="text-xs text-slate-400 truncate text-center">{user.email}</p>
            </div>
          ))}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div className="context-menu fixed z-9999 bg-slate-900 border border-blue-900 rounded-lg w-36 sm:w-44 shadow-lg"
            style={{ top: contextMenu.y, left: contextMenu.x }}>
            <button onClick={() => handlePreview(selectedUser)} className="block px-4 py-2 hover:bg-slate-800 w-full text-left cursor-pointer">Preview</button>
            <button onClick={() => { setEditUser({ nome: selectedUser.nome, email: selectedUser.email, telefone: selectedUser.telefone, departamento: selectedUser.departamento, nivel: selectedUser.nivel }); setEditModal(true); closeContextMenu(); }} className="block px-4 py-2 hover:bg-slate-800 w-full text-left cursor-pointer">Editar Dados</button>
            <button onClick={() => { setNovaSenha(""); setSenhaModal(true); closeContextMenu(); }} className="block px-4 py-2 hover:bg-slate-800 w-full text-left cursor-pointer">Editar Senha</button>
            <button onClick={() => { setDeleteModal(true); closeContextMenu(); }} className="block px-4 py-2 text-red-400 hover:bg-slate-800 w-full text-left cursor-pointer">Excluir</button>
          </div>
        )}

        {/* Modal Criar Usuário */}
        <ModalSmall isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Usuário" icon="fas fa-user-plus">
          <input value={novoUsuario.nome} onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} placeholder="Nome" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2"/>
          <input value={novoUsuario.email} onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })} placeholder="Email" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2"/>
          <input value={novoUsuario.telefone} onChange={(e) => setNovoUsuario({ ...novoUsuario, telefone: e.target.value })} placeholder="Telefone" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2"/>
          <input type="password" value={novoUsuario.senha} onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })} placeholder="Senha" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2"/>
          <select value={novoUsuario.departamento} onChange={(e) => setNovoUsuario({ ...novoUsuario, departamento: e.target.value })} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2">
            <option value="">Selecionar Departamento</option>
            {departamentos.map(dep => <option key={dep.id} value={dep.nome}>{dep.nome}</option>)}
          </select>
          <select value={novoUsuario.nivel} onChange={(e) => setNovoUsuario({ ...novoUsuario, nivel: e.target.value })} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4">
            <option value="Gerente">Gerente</option>
            <option value="Staff">Staff</option>
          </select>
          <button onClick={handleCriarUsuario} className="w-full py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg cursor-pointer">Adicionar</button>
        </ModalSmall>

        {/* Modal Editar Dados */}
        <ModalSmall isOpen={editModal} onClose={() => setEditModal(false)} title="Editar Usuário" icon="fas fa-edit">
          <input value={editUser.nome} onChange={(e) => setEditUser({ ...editUser, nome: e.target.value })} placeholder="Nome" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2"/>
          <input value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} placeholder="Email" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2"/>
          <input value={editUser.telefone} onChange={(e) => setEditUser({ ...editUser, telefone: e.target.value })} placeholder="Telefone" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2"/>
          <select value={editUser.departamento} onChange={(e) => setEditUser({ ...editUser, departamento: e.target.value })} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-2">
            {departamentos.map(dep => <option key={dep.id} value={dep.nome}>{dep.nome}</option>)}
          </select>
          <select value={editUser.nivel} onChange={(e) => setEditUser({ ...editUser, nivel: e.target.value })} className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4">
            <option value="Gerente">Gerente</option>
            <option value="Staff">Staff</option>
          </select>
          <button onClick={handleEditarUsuario} className="w-full py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg cursor-pointer">Salvar Alterações</button>
        </ModalSmall>

        {/* Modal Editar Senha */}
        <ModalSmall isOpen={senhaModal} onClose={() => setSenhaModal(false)} title="Editar Senha" icon="fas fa-key">
          <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Nova Senha" className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"/>
          <button onClick={handleEditarSenha} className="w-full py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg cursor-pointer">Salvar Senha</button>
        </ModalSmall>

        {/* Modal Excluir */}
        <ModalSmall isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirmar Exclusão" icon="fas fa-trash">
          <button onClick={handleDelete} className="w-full py-2 bg-red-500 text-white rounded-lg cursor-pointer">Excluir</button>
        </ModalSmall>

        {/* Modal Preview */}
        <ModalSmall isOpen={!!previewUser} onClose={() => setPreviewUser(null)} title="Detalhes do Usuário" icon="fas fa-eye">
          {previewUser && (
            <div className="flex flex-col gap-2">
              <p className="text-slate-300"><strong>Nome:</strong> {previewUser.nome}</p>
              <p className="text-slate-300"><strong>Email:</strong> {previewUser.email}</p>
              <p className="text-slate-300"><strong>Telefone:</strong> {previewUser.telefone}</p>
              <p className="text-slate-300"><strong>Departamento:</strong> {previewUser.departamento}</p>
              <p className="text-slate-300"><strong>Nível:</strong> {previewUser.nivel}</p>
            </div>
          )}
        </ModalSmall>

      </GerenteLayout>
    </>
  );
}