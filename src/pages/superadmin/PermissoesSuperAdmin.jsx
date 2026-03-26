import { useState } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";

export default function PermissoesSuperAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulação de dados
  const [usuarios] = useState([
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
  ]);

  const [pastas] = useState([
    { id: 1, nome: "Financeiro" },
    { id: 2, nome: "RH" },
  ]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");

  const [permissoes, setPermissoes] = useState({
    ler: true,
    escrever: false,
    executar: false,
    apagar: false,
  });

  const [listaPermissoes, setListaPermissoes] = useState([]);

  const togglePermissao = (key) => {
    setPermissoes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSalvar = () => {
    if (!selectedUser || !selectedFolder) return;

    setListaPermissoes((prev) => [
      ...prev,
      {
        id: Date.now(),
        usuario: usuarios.find((u) => u.id == selectedUser)?.nome,
        pasta: pastas.find((p) => p.id == selectedFolder)?.nome,
        permissoes: { ...permissoes },
      },
    ]);

    // reset
    setSelectedUser("");
    setSelectedFolder("");
    setPermissoes({
      ler: true,
      escrever: false,
      executar: false,
      apagar: false,
    });

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setListaPermissoes((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <title>Permissões | Mukanda Cloud</title>

      <SuperAdminLayout title="Permissões">

        {/* BOTÃO */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg cursor-pointer"
          >
            <i className="fas fa-shield-alt mr-2"></i>
            Nova Permissão
          </button>
        </div>

        {/* LISTA */}
        <div className="bg-slate-900 border border-blue-900 rounded-xl p-6">
          <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider">
            Permissões Ativas
          </h2>

          {listaPermissoes.length === 0 && (
            <p className="text-slate-400 text-sm">
              Nenhuma permissão atribuída.
            </p>
          )}

          <div className="space-y-3">
            {listaPermissoes.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-800 border border-blue-900 rounded-lg p-4"
              >
                <div className="text-sm text-slate-300">
                  <p>
                    <span className="text-white font-semibold">
                      {item.usuario}
                    </span>{" "}
                    →{" "}
                    <span className="text-cyan-400">{item.pasta}</span>
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {Object.entries(item.permissoes)
                      .filter(([_, v]) => v)
                      .map(([k]) => k)
                      .join(", ")}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 sm:mt-0 px-3 py-1 text-xs bg-red-500 hover:bg-red-400 text-white rounded cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL */}
        <ModalSmall
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nova Permissão"
          icon="fas fa-shield-alt"
        >
          <div className="flex flex-col gap-4">

            {/* Usuário */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg"
            >
              <option value="">Selecionar usuário</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>

            {/* Pasta */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg"
            >
              <option value="">Selecionar pasta</option>
              {pastas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>

            {/* Permissões */}
            <div className="bg-slate-800 border border-blue-900 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider">
                Permissões
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400">
                  <input
                    type="checkbox"
                    checked={permissoes.ler}
                    onChange={() => togglePermissao("ler")}
                    className="accent-cyan-500"
                  />
                  Ler
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400">
                  <input
                    type="checkbox"
                    checked={permissoes.escrever}
                    onChange={() => togglePermissao("escrever")}
                    className="accent-cyan-500"
                  />
                  Escrever
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400">
                  <input
                    type="checkbox"
                    checked={permissoes.executar}
                    onChange={() => togglePermissao("executar")}
                    className="accent-cyan-500"
                  />
                  Executar
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400">
                  <input
                    type="checkbox"
                    checked={permissoes.apagar}
                    onChange={() => togglePermissao("apagar")}
                    className="accent-cyan-500"
                  />
                  Apagar
                </label>

              </div>
            </div>

            {/* Botão */}
            <button
              onClick={handleSalvar}
              className="py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg cursor-pointer"
            >
              Salvar Permissão
            </button>

          </div>
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}