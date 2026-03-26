import { useState } from "react";
import GerenteLayout from "./components/GerenteLayout";
import ModalSmall from "./components/ModalSmall";
import { Link } from "react-router-dom";

export default function DashboardGerente() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaPasta, setNovaPasta] = useState("");

  // Permissões
  const [permissoes, setPermissoes] = useState({
    ler: true,
    escrever: false,
    executar: false,
    apagar: false,
  });

  const togglePermissao = (key) => {
    setPermissoes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const stats = [
    { id: 1, title: "Total de Arquivos", value: 1240, icon: "fas fa-file" },
    { id: 2, title: "Armazenamento", value: "32GB / 100GB", icon: "fas fa-database" },
    { id: 3, title: "Usuários", value: 18, icon: "fas fa-users" },
    { id: 4, title: "Departamentos", value: 5, icon: "fas fa-building" },
  ];

  const atividades = [
    { user: "João Silva", action: "enviou", file: "relatorio.pdf", time: "Agora" },
    { user: "Maria Santos", action: "apagou", file: "contrato.docx", time: "5 min atrás" },
    { user: "Carlos Mendes", action: "criou pasta", file: "Financeiro", time: "10 min atrás" },
  ];

  const arquivos = [
    { name: "Relatório Financeiro.pdf", size: "2MB" },
    { name: "Plano Marketing.docx", size: "1.2MB" },
    { name: "Apresentação.pptx", size: "3.5MB" },
  ];

  const handleCriarPasta = () => {
    console.log("Criando pasta:", novaPasta);
    console.log("Permissões:", permissoes);

    setNovaPasta("");
    setPermissoes({
      ler: true,
      escrever: false,
      executar: false,
      apagar: false,
    });

    setIsModalOpen(false);
  };

  return (
    <>
      <title>Dashboard | Mukanda Cloud</title>

      <GerenteLayout title="Dashboard SuperAdmin">

        {/* BOTÃO NOVA PASTA */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition"
          >
            <i className="fas fa-folder-plus mr-2"></i>
            Nova Pasta
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="p-6 rounded-xl bg-slate-900 border border-blue-900 flex items-center justify-between hover:border-cyan-500 transition-all"
            >
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </h3>
              </div>
              <i className={`${stat.icon} text-2xl text-cyan-500`}></i>
            </div>
          ))}
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* ATIVIDADES */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider">
              Atividades Recentes
            </h2>

            <ul className="divide-y divide-blue-900">
              {atividades.map((a, index) => (
                <li key={index} className="py-3">
                  <p className="text-sm text-slate-300">
                    <span className="text-white font-semibold">{a.user}</span>{" "}
                    {a.action}{" "}
                    <span className="text-cyan-300">{a.file}</span>
                  </p>
                  <span className="text-xs text-slate-500">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ARQUIVOS */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider">
              Arquivos Recentes
            </h2>

            <ul className="divide-y divide-blue-900">
              {arquivos.map((file, index) => (
                <li
                  key={index}
                  className="py-3 flex justify-between items-center"
                >
                  <span className="text-slate-300">{file.name}</span>
                  <span className="text-xs text-slate-500">{file.size}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/dashboard/superadmin/arquivos"
              className="mt-4 inline-block text-sm font-semibold text-cyan-500 hover:text-cyan-300 transition"
            >
              Ver todos →
            </Link>
          </div>
        </div>

        {/* MODAL NOVA PASTA */}
        <ModalSmall
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Criar Nova Pasta"
          icon="fas fa-folder-plus"
        >
          <div className="flex flex-col gap-4">

            {/* Nome */}
            <input
              type="text"
              placeholder="Nome da pasta"
              value={novaPasta}
              onChange={(e) => setNovaPasta(e.target.value)}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />

            {/* Permissões */}
            <div className="bg-slate-800 border border-blue-900 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider">
                Permissões
              </p>

              {/* Permissões */}
              <div className="bg-slate-800 border border-blue-900 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider">
                  Permissões
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400 transition">
                    <input
                      type="checkbox"
                      checked={permissoes.ler}
                      onChange={() => togglePermissao("ler")}
                      className="accent-cyan-500 cursor-pointer"
                    />
                    Ler
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400 transition">
                    <input
                      type="checkbox"
                      checked={permissoes.escrever}
                      onChange={() => togglePermissao("escrever")}
                      className="accent-cyan-500 cursor-pointer"
                    />
                    Escrever
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400 transition">
                    <input
                      type="checkbox"
                      checked={permissoes.executar}
                      onChange={() => togglePermissao("executar")}
                      className="accent-cyan-500 cursor-pointer"
                    />
                    Executar
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400 transition">
                    <input
                      type="checkbox"
                      checked={permissoes.apagar}
                      onChange={() => togglePermissao("apagar")}
                      className="accent-cyan-500 cursor-pointer"
                    />
                    Apagar
                  </label>

                </div>
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={handleCriarPasta}
              className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition"
            >
              Criar Pasta
            </button>

          </div>
        </ModalSmall>

      </GerenteLayout>
    </>
  );
}