import { useEffect, useState } from "react";
import GerenteLayout from "./components/GerenteLayout";
import ModalSmall from "./components/ModalSmall";
import { Link } from "react-router-dom";

// Organização de Imports conforme SuperAdmin
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { folderSchema } from "../../validations/folderSchema";
import { createFolder, getNodes } from "../../services/fileService";
import { getLogs, groupLogs } from "../../services/logService";
import { getUsers } from "../../services/userService";

export default function DashboardGerente() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [totalEquipa, setTotalEquipa] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [logGroups, setLogGroups] = useState({ hoje: [], ontem: [], antigos: [] });

  const LOG_LIMIT = 5;
  const user = JSON.parse(localStorage.getItem("user"));

  // Configuração do Formulário (Padrão SuperAdmin)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(folderSchema),
    defaultValues: { nome: "" },
  });

  // FetchData Organizado com Promise.all
  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [files, logs, allUsers] = await Promise.all([
        getNodes(),
        getLogs(),
        getUsers(),
      ]);

      // Filtro por Departamento (Contexto de Gerente)
      const myDeptId = user?.dept_id;
      const myFiles = files.filter(f => f.department === myDeptId);
      const myTeam = allUsers.filter(u => u.dept_id === myDeptId);
      
      const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setNodes(myFiles);
      setLogGroups(groupLogs(sortedLogs));
      setTotalEquipa(myTeam.length);
    } catch (error) {
      console.error("Erro no Dashboard Gerente:", error);
      toast.error("Erro ao sincronizar dados do departamento");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Lógica de Submissão Organizada
  const onSubmit = async (data) => {
    try {
      const payload = { 
        ...data, 
        department: user?.dept_id // Gerente sempre vincula ao seu próprio departamento
      };

      await createFolder(payload);
      toast.success("Pasta criada com sucesso");
      reset();
      setIsModalOpen(false);
      
      // Refresh de dados
      const updatedNodes = await getNodes();
      setNodes(updatedNodes.filter(f => f.department === user?.dept_id));
    } catch (error) {
      const msg = error.response?.data?.name?.[0] || "Erro ao criar pasta";
      toast.error(msg);
    }
  };

  const stats = [
    { id: 1, title: "Ficheiros do Dept", value: nodes.length, icon: "fas fa-file" },
    { id: 2, title: "Armazenamento", value: "12GB / 50GB", icon: "fas fa-database" },
    { id: 3, title: "Minha Equipa", value: totalEquipa, icon: "fas fa-users" },
  ];

  return (
    <>
      <title>Dashboard | Mukanda Cloud</title>
      <GerenteLayout title="Dashboard Gerente">

        {/* BOTÃO NOVA PASTA */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => { reset(); setIsModalOpen(true); }}
            className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition shadow-lg active:scale-95 flex items-center"
          >
            <i className="fas fa-folder-plus mr-2"></i> Nova Pasta
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="p-6 rounded-xl bg-slate-900 border border-blue-900 flex items-center justify-between hover:border-cyan-500 transition-all group">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider group-hover:text-slate-300">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {loadingData ? <span className="inline-block w-8 h-6 bg-slate-800 animate-pulse rounded"></span> : stat.value}
                </h3>
              </div>
              <i className={`${stat.icon} text-2xl text-cyan-500 group-hover:scale-110 transition-transform`}></i>
            </div>
          ))}
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
          
          {/* ATIVIDADES (FEED DA EQUIPA) */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span> Atividades da Equipa
            </h2>
            {loadingData ? <div className="h-20 bg-slate-800 animate-pulse rounded"></div> : (
              <>
                {["hoje", "ontem", "antigos"].map((group) => (
                  logGroups[group]?.length > 0 && (
                    <div key={group} className="mb-4">
                      <p className="text-[10px] font-bold text-cyan-400 mb-2 capitalize bg-cyan-500/10 w-max px-2 rounded">{group}</p>
                      <ul className="divide-y divide-blue-900/50">
                        {logGroups[group].slice(0, LOG_LIMIT).map((a) => (
                          <li key={a.id} className="py-2 hover:bg-white/5 transition-colors px-1 rounded">
                            <p className="text-sm text-slate-300">
                              <span className="text-white font-medium">{a.user}</span> {a.action} <span className="text-cyan-300">{a.target}</span>
                            </p>
                            <span className="text-[10px] text-slate-500">{a.timestamp_label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
                <Link to="/dashboard/gerente/atividades" className="text-xs text-cyan-500 hover:text-cyan-300 font-medium transition mt-4 inline-block">Ver feed completo →</Link>
              </>
            )}
          </div>

          {/* ARQUIVOS RECENTES */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-history text-xs"></i> Ficheiros do Dept
            </h2>
            <ul className="divide-y divide-blue-900/50">
              {loadingData ? <div className="h-20 bg-slate-800 animate-pulse rounded"></div> : nodes.length === 0 ? (
                <li className="py-6 text-center text-slate-500 text-sm italic">Nenhum ficheiro neste departamento</li>
              ) : (
                nodes.slice(0, LOG_LIMIT).map((item) => (
                  <li key={item.id} className="py-3 flex justify-between items-center group">
                    <span className="text-slate-300 flex items-center gap-3 truncate pr-4">
                      <i className={item.type === "folder" ? "fas fa-folder text-yellow-500" : "fas fa-file-alt text-cyan-500"} />
                      <span className="truncate group-hover:text-white transition-colors">{item.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                      {item.type === "file" ? item.size || "0 KB" : "PASTA"}
                    </span>
                  </li>
                ))
              )}
            </ul>
            <Link to="/dashboard/gerente/arquivos" className="mt-6 inline-block text-sm font-semibold text-cyan-500 hover:text-cyan-300 transition">Explorar repositório →</Link>
          </div>
        </div>

        {/* MODAL NOVA PASTA (Organizado com Hook Form) */}
        <ModalSmall isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Pasta" icon="fas fa-folder-plus">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Nome da Pasta</label>
              <input
                type="text"
                autoFocus
                placeholder="Ex: Relatórios de Vendas"
                {...register("nome")}
                className={`p-3 rounded-lg bg-slate-800 text-white border ${errors.nome ? 'border-red-500' : 'border-blue-900'} focus:border-cyan-500 focus:outline-none transition-all shadow-inner`}
              />
              {errors.nome && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.nome.message}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-3 cursor-pointer bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold rounded-lg transition shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><i className="fas fa-spinner animate-spin"></i> Criando...</> : "Criar Pasta"}
            </button>
          </form>
        </ModalSmall>

      </GerenteLayout>
    </>
  );
}