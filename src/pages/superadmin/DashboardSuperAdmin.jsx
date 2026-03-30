import { useEffect, useState } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { folderSchema } from "../../validations/folderSchema";
import { createFolder, getNodes } from "../../services/fileService";

export default function DashboardSuperAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [loadingNodes, setLoadingNodes] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(folderSchema),
    defaultValues: {
      nome: "",
      permissoes: {
        ler: true,
        escrever: false,
        executar: false,
        apagar: false,
      },
    },
  });

  const permissoes = watch("permissoes");

  const togglePermissao = (key) => {
    setValue(`permissoes.${key}`, !permissoes[key]);
  };

  // 🔥 FETCH CORRIGIDO
  const fetchNodes = async () => {
    try {
      setLoadingNodes(true);

      const data = await getNodes();

      // já vem normalizado do service, mas mantemos segurança
      const safeData = Array.isArray(data) ? data : [];

      const filesOnly = safeData.filter(
        (item) => item?.type === "file"
      );

      setNodes(filesOnly);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar arquivos");
      setNodes([]);
    } finally {
      setLoadingNodes(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  // 🔥 CREATE FOLDER
  const onSubmit = async (data) => {
    try {
      await createFolder(data);

      toast.success("Pasta criada com sucesso 🚀");

      reset();
      setIsModalOpen(false);

      fetchNodes();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pasta");
    }
  };

  const stats = [
    { id: 1, title: "Total de Arquivos", value: nodes.length, icon: "fas fa-file" },
    { id: 2, title: "Armazenamento", value: "32GB / 100GB", icon: "fas fa-database" },
    { id: 3, title: "Equipa", value: 18, icon: "fas fa-users" },
    { id: 4, title: "Departamentos", value: 5, icon: "fas fa-building" },
  ];

  const atividades = [
    { user: "João Silva", action: "enviou", file: "relatorio.pdf", time: "Agora" },
    { user: "Maria Santos", action: "apagou", file: "contrato.docx", time: "5 min atrás" },
    { user: "Carlos Mendes", action: "criou pasta", file: "Financeiro", time: "10 min atrás" },
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
                  {stat.value}
                </h3>
              </div>

              <i className={`${stat.icon} text-2xl text-cyan-500`}></i>
            </div>
          ))}
        </div>

        {/* GRID */}
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
              {loadingNodes ? (
                <li className="py-3 text-slate-400 text-sm">
                  Carregando...
                </li>
              ) : nodes.length === 0 ? (
                <li className="py-3 text-slate-400 text-sm">
                  Nenhum arquivo encontrado
                </li>
              ) : (
                nodes.slice(0, 5).map((file) => (
                  <li
                    key={file.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <span className="text-slate-300">
                      {file.name || "Sem nome"}
                    </span>

                    <span className="text-xs text-slate-500">
                      {file.size || "--"}
                    </span>
                  </li>
                ))
              )}
            </ul>

            <Link
              to="/dashboard/superadmin/arquivos"
              className="mt-4 inline-block text-sm font-semibold text-cyan-500 hover:text-cyan-300 transition"
            >
              Ver todos →
            </Link>
          </div>
        </div>

        {/* MODAL */}
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

            {errors.nome && (
              <p className="text-red-500 text-xs">
                {errors.nome.message}
              </p>
            )}

            <div className="bg-slate-800 border border-blue-900 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider">
                Permissões
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {["ler", "escrever", "executar", "apagar"].map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cyan-400 transition"
                  >
                    <input
                      type="checkbox"
                      checked={permissoes[perm]}
                      onChange={() => togglePermissao(perm)}
                      className="accent-cyan-500 cursor-pointer"
                    />
                    {perm.charAt(0).toUpperCase() + perm.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 cursor-pointer bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-semibold rounded-lg transition"
            >
              {isSubmitting ? "Criando..." : "Criar Pasta"}
            </button>

          </form>
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}