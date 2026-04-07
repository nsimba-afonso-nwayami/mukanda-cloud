import { useEffect, useState } from "react";
import StaffLayout from "./components/StaffLayout";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getNodes } from "../../services/fileService";

export default function DashboardStaff() {
  const [nodes, setNodes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const FILE_LIMIT = 10; // Aumentado para melhor proveito visual
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const files = await getNodes();

      // Filtra apenas arquivos do departamento do Staff
      const myFiles = files.filter(f => f.department === user?.dept_id);
      setNodes(myFiles);
    } catch (error) {
      console.error("Erro no Dashboard Staff:", error);
      toast.error("Erro ao sincronizar repositório");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const stats = [
    { id: 1, title: "Ficheiros no Departamento", value: nodes.length, icon: "fas fa-file-invoice" },
    { id: 2, title: "Espaço em Nuvem", value: "Ativo", icon: "fas fa-cloud" },
    { id: 3, title: "Meu Departamento", value: user?.dept_name || "Geral", icon: "fas fa-building" },
  ];

  return (
    <>
      <title>Dashboard | Mukanda Cloud</title>
      <StaffLayout title="Painel de Consulta">

        {/* HEADER INFORMATIVO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Bem-vindo, {user?.first_name}</h1>
            <p className="text-xs text-slate-400">Você tem acesso de consulta aos documentos do seu setor.</p>
          </div>
          {/* O botão de Criar Pasta foi removido por restrição de permissão (403) */}
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="p-6 rounded-xl bg-slate-900 border border-blue-900/50 flex items-center justify-between hover:border-cyan-500/50 transition-all group">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="text-xl font-bold text-white mt-1">{loadingData ? "..." : stat.value}</h3>
              </div>
              <i className={`${stat.icon} text-xl text-cyan-500/80 group-hover:scale-110 transition-transform`}></i>
            </div>
          ))}
        </div>

        {/* LISTA DE ARQUIVOS */}
        <div className="bg-slate-900 border border-blue-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-blue-900/50 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-folder-open text-xs"></i> Repositório do Departamento
            </h2>
            <Link to="/dashboard/staff/arquivos" className="text-xs text-slate-400 hover:text-cyan-400 transition font-medium">
              Ver todos arquivos →
            </Link>
          </div>

          <div className="p-2">
            <ul className="divide-y divide-blue-900/30">
              {loadingData ? (
                <div className="p-10 space-y-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-800 animate-pulse rounded-lg"></div>)}
                </div>
              ) : nodes.length === 0 ? (
                <li className="py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-3">
                  <i className="fas fa-search text-3xl opacity-20"></i>
                  Nenhum ficheiro disponível para consulta.
                </li>
              ) : (
                nodes.slice(0, FILE_LIMIT).map((item) => (
                  <li key={item.id} className="py-4 px-4 flex justify-between items-center group hover:bg-blue-900/10 transition-colors rounded-lg">
                    <div className="flex items-center gap-4 truncate pr-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 border border-blue-900 group-hover:border-cyan-500/50 transition-colors">
                        <i className={item.type === "folder" ? "fas fa-folder text-yellow-500" : "fas fa-file-alt text-cyan-500"} />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{item.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                          {item.type === "folder" ? "Diretório de Trabalho" : "Documento do Setor"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden md:block text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-blue-900/30">
                        {item.type === "file" ? item.size || "---" : "PASTA"}
                      </span>
                      {/* Apenas botão de visualização/detalhes, sem ações de edição */}
                      <button className="text-slate-500 hover:text-cyan-500 p-2 transition-colors">
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

      </StaffLayout>
    </>
  );
}