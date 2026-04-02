import { useEffect, useState } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { folderSchema } from "../../validations/folderSchema";
import { createFolder, getNodes } from "../../services/fileService";
import { getLogs, groupLogs } from "../../services/logService";
import { getUsers } from "../../services/userService";
import { getDepartments } from "../../services/departmentService";

export default function DashboardSuperAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDepts, setTotalDepts] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [logGroups, setLogGroups] = useState({ hoje: [], ontem: [], antigos: [] });

  const LOG_LIMIT = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(folderSchema),
    defaultValues: { nome: "" },
  });

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [files, logs, users, depts] = await Promise.all([
        getNodes(),
        getLogs(),
        getUsers(),
        getDepartments(),
      ]);

      setNodes(files);
      const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setLogGroups(groupLogs(sortedLogs));
      setTotalUsers(users.length || 0);
      setTotalDepts(depts.length || 0);
    } catch (error) {
      console.error("Erro no Dashboard:", error);
      toast.error("Erro ao sincronizar dados do servidor");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = { ...data };

      // Lógica de fallback para SuperAdmin com dept_id null
      if (!user?.dept_id) {
        const depts = await getDepartments();
        if (depts && depts.length > 0) {
          payload.department = depts[0].id; // Vincula ao primeiro departamento encontrado
        } else {
          toast.error("Não existem departamentos cadastrados no sistema.");
          return;
        }
      }

      await createFolder(payload);
      
      toast.success("Pasta criada com sucesso");
      reset();
      setIsModalOpen(false);
      
      const updatedNodes = await getNodes();
      setNodes(updatedNodes);
      
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data);
      const msg = error.response?.data?.department?.[0] || 
                  error.response?.data?.name?.[0] || 
                  "Erro ao criar pasta";
      toast.error(msg);
    }
  };

  const stats = [
    { id: 1, title: "Total de Arquivos", value: nodes.length, icon: "fas fa-file" },
    { id: 2, title: "Armazenamento", value: "32GB / 100GB", icon: "fas fa-database" },
    { id: 3, title: "Equipa", value: totalUsers, icon: "fas fa-users" },
    { id: 4, title: "Departamentos", value: totalDepts, icon: "fas fa-building" },
  ];

  return (
    <>
      <title>Dashboard | Mukanda Cloud</title>
      <SuperAdminLayout title="Dashboard SuperAdmin">

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition shadow-lg active:scale-95"
          >
            <i className="fas fa-folder-plus mr-2"></i> Nova Pasta
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
          {/* ATIVIDADES */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span> Atividades Recentes
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
                <Link to="/dashboard/superadmin/atividades" className="text-xs text-cyan-500 hover:text-cyan-300 font-medium transition mt-4 inline-block">Ver histórico completo →</Link>
              </>
            )}
          </div>

          {/* ARQUIVOS */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-history text-xs"></i> Ficheiros Recentes
            </h2>
            <ul className="divide-y divide-blue-900/50">
              {loadingData ? <div className="h-20 bg-slate-800 animate-pulse rounded"></div> : nodes.length === 0 ? (
                <li className="py-6 text-center text-slate-500 text-sm italic">Nenhum ficheiro disponível</li>
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
            <Link to="/dashboard/superadmin/arquivos" className="mt-6 inline-block text-sm font-semibold text-cyan-500 hover:text-cyan-300 transition">Gerenciar repositório →</Link>
          </div>
        </div>

        <ModalSmall isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Pasta" icon="fas fa-folder-plus">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Nome da Pasta</label>
              <input
                type="text"
                autoFocus
                placeholder="Ex: Documentos Fiscais"
                {...register("nome")}
                className={`p-3 rounded-lg bg-slate-800 text-white border ${errors.nome ? 'border-red-500' : 'border-blue-900'} focus:border-cyan-500 focus:outline-none transition-all shadow-inner`}
              />
              {errors.nome && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.nome.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 cursor-pointer bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold rounded-lg transition shadow-lg flex items-center justify-center gap-2">
              {isSubmitting ? <><i className="fas fa-spinner animate-spin"></i> Criando...</> : "Criar Pasta"}
            </button>
          </form>
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}