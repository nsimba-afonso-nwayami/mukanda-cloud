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
import { getUsers } from "../../services/userService"; // Adicionado
import { getDepartments } from "../../services/departmentService"; // Adicionado

export default function DashboardSuperAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nodes, setNodes] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDepts, setTotalDepts] = useState(0);
  const [loadingNodes, setLoadingNodes] = useState(true);

  const [logGroups, setLogGroups] = useState({
    hoje: [],
    ontem: [],
    antigos: [],
  });

  const [loadingLogs, setLoadingLogs] = useState(true);

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

  /**
   * CARREGAMENTO DE DADOS (ATIVIDADES, ARQUIVOS, USUÁRIOS E DEPTS)
   */
  const fetchData = async () => {
    try {
      setLoadingNodes(true);
      setLoadingLogs(true);

      // Chamada paralela para otimizar o carregamento
      const [files, logs, users, depts] = await Promise.all([
        getNodes(),
        getLogs(),
        getUsers(),
        getDepartments(),
      ]);

      // Processar Arquivos
      const sortedFiles = Array.isArray(files) ? [...files].sort((a, b) => b.id - a.id) : [];
      setNodes(sortedFiles);

      // Processar Logs
      const sortedLogs = Array.isArray(logs)
        ? [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        : [];
      setLogGroups(groupLogs(sortedLogs));

      // Processar Totais
      setTotalUsers(users.length || 0);
      setTotalDepts(depts.length || 0);

    } catch (error) {
      console.error("Erro no Dashboard:", error);
      toast.error("Erro ao sincronizar dados do servidor");
    } finally {
      setLoadingNodes(false);
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await createFolder(data);
      toast.success("Pasta criada com sucesso 🚀");
      reset();
      setIsModalOpen(false);
      fetchData(); // Recarrega tudo para atualizar total de arquivos
    } catch (error) {
      toast.error("Erro ao criar pasta");
    }
  };

  // Stats dinâmicos com dados reais
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

        {/* BOTÃO */}
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
                  {loadingNodes ? "..." : stat.value}
                </h3>
              </div>

              <i className={`${stat.icon} text-2xl text-cyan-500`}></i>
            </div>
          ))}
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">

          {/* ATIVIDADES */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider">
              Atividades Recentes
            </h2>

            {loadingLogs ? (
              <p className="text-slate-400 text-sm italic">Carregando...</p>
            ) : (
              <>
                {["hoje", "ontem", "antigos"].map((group) => (
                  logGroups[group]?.length > 0 && (
                    <div key={group} className="mb-4">
                      <p className="text-xs text-cyan-400 mb-2 capitalize">{group}</p>
                      <ul className="divide-y divide-blue-900">
                        {logGroups[group].slice(0, LOG_LIMIT).map((a) => (
                          <li key={a.id} className="py-2">
                            <p className="text-sm text-slate-300">
                              <span className="text-white font-semibold">{a.user}</span>{" "}
                              {a.action}{" "}
                              <span className="text-cyan-300">{a.target}</span>
                            </p>
                            <span className="text-xs text-slate-500">
                              {a.timestamp?.fromNow?.() || ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
                
                <Link
                  to="/dashboard/superadmin/atividades"
                  className="text-xs text-cyan-500 hover:text-cyan-300 transition inline-block mt-2"
                >
                  Ver histórico completo →
                </Link>
              </>
            )}
          </div>

          {/* ARQUIVOS */}
          <div className="bg-slate-900 border border-blue-900 rounded-xl p-6">
            <h2 className="text-sm font-bold text-cyan-500 mb-4 uppercase tracking-wider">
              Arquivos Recentes
            </h2>

            <ul className="divide-y divide-blue-900">
              {loadingNodes ? (
                <li className="py-3 text-slate-400 text-sm">Carregando...</li>
              ) : nodes.length === 0 ? (
                <li className="py-3 text-slate-400 text-sm">Nenhum arquivo encontrado</li>
              ) : (
                nodes.slice(0, LOG_LIMIT).map((item) => (
                  <li key={item.id} className="py-3 flex justify-between items-center">
                    <span className="text-slate-300 flex items-center gap-2">
                      <i className={item.type === "folder" ? "fas fa-folder text-yellow-400" : "fas fa-file text-cyan-500"} />
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.type === "file" ? item.size || "--" : "Pasta"}
                    </span>
                  </li>
                ))
              )}
            </ul>

            <Link
              to="/dashboard/superadmin/arquivos"
              className="mt-4 inline-block text-sm font-semibold text-cyan-500 hover:text-cyan-300 transition"
            >
              Gerenciar arquivos →
            </Link>
          </div>
        </div>

        {/* MODAL CRIAR PASTA */}
        <ModalSmall
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Criar Nova Pasta"
          icon="fas fa-folder-plus"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome da pasta"
              {...register("nome")}
              className="p-3 rounded-lg bg-slate-800 text-white border border-blue-900 focus:border-cyan-500 focus:outline-none"
            />
            {errors.nome && <p className="text-red-500 text-xs">{errors.nome.message}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-semibold rounded-lg transition"
            >
              {isSubmitting ? "Criando..." : "Confirmar Criação"}
            </button>
          </form>
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}