import { useEffect, useState } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";

import { getLogs } from "../../services/logService";

export default function AtividadesSuperAdmin() {
  const [atividades, setAtividades] = useState([]);

  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [verMais, setVerMais] = useState(false);

  const [loading, setLoading] = useState(true);

  const departamentos = ["Financeiro", "RH", "TI"];
  const usuarios = ["João Silva", "Maria Santos", "Pedro Costa"];

  /**
   * =========================
   * FETCH LOGS (API REAL)
   * =========================
   */
  const fetchLogs = async () => {
    try {
      setLoading(true);

      const data = await getLogs();

      // ADAPT PARA TEU LAYOUT ATUAL SEM MEXER NA UI
      const formatted = data.map((log) => ({
        id: log.id,
        usuario: log.user,
        departamento: log.target || "-", // backend pode não ter dept
        acao: log.action,
        data: log.timestamp
          ? log.timestamp.format("YYYY-MM-DD HH:mm:ss")
          : "",
      }));

      setAtividades(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /**
   * =========================
   * FILTRAGEM (SEM ALTERAR UI)
   * =========================
   */
  const atividadesFiltradas = atividades
    .filter((a) => {
      const matchUsuario = filtroUsuario
        ? a.usuario === filtroUsuario
        : true;

      const matchDep = filtroDepartamento
        ? a.departamento === filtroDepartamento
        : true;

      const matchData = filtroData
        ? a.data.split(" ")[0] === filtroData
        : true;

      const matchPesquisa = pesquisa
        ? a.acao.toLowerCase().includes(pesquisa.toLowerCase())
        : true;

      return matchUsuario && matchDep && matchData && matchPesquisa;
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  /**
   * =========================
   * AGRUPAR POR DIA (EXATAMENTE IGUAL AO TEU LAYOUT)
   * =========================
   */
  const atividadesPorDia = atividadesFiltradas.reduce((acc, atividade) => {
    const dia = atividade.data.split(" ")[0];

    if (!acc[dia]) acc[dia] = [];

    acc[dia].push(atividade);

    return acc;
  }, {});

  const datas = Object.keys(atividadesPorDia);

  const datasAMostrar = verMais ? datas.length : 2;

  const datasVisiveis = datas.slice(0, datasAMostrar);

  return (
    <>
      <title>Atividades | Mukanda Cloud</title>

      <SuperAdminLayout title="Atividades">

        {/* ================= FILTROS (INTACTO) ================= */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-2 mb-4">

          <input
            type="text"
            placeholder="Pesquisar ações..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg w-full"
          />

          <select
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg w-full md:w-auto"
          >
            <option value="">Todos os usuários</option>
            {usuarios.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <select
            value={filtroDepartamento}
            onChange={(e) => setFiltroDepartamento(e.target.value)}
            className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg w-full md:w-auto"
          >
            <option value="">Todos os departamentos</option>
            {departamentos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg w-full md:w-auto"
          />

        </div>

        {/* ================= LISTA ================= */}
        <div className="space-y-6">

          {loading ? (
            <p className="text-slate-400 text-center">Carregando...</p>
          ) : (
            datasVisiveis.map((dia) => (
              <div key={dia}>

                <h3 className="text-slate-400 font-semibold mb-2">
                  {dia}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {atividadesPorDia[dia].map((a) => (
                    <div
                      key={a.id}
                      className="bg-slate-900 border border-blue-900 rounded-xl p-4 flex flex-col gap-1"
                    >
                      <p className="text-sm text-slate-300 font-semibold truncate">
                        {a.acao}
                      </p>

                      <p className="text-xs text-slate-400 truncate">
                        <strong>Usuário:</strong> {a.usuario}
                      </p>

                      <p className="text-xs text-slate-400 truncate">
                        <strong>Departamento:</strong> {a.departamento}
                      </p>

                      <p className="text-xs text-slate-400">
                        <strong>Hora:</strong> {a.data.split(" ")[1]}
                      </p>
                    </div>
                  ))}

                </div>

              </div>
            ))
          )}

          {!loading && atividadesFiltradas.length === 0 && (
            <p className="text-slate-400 text-center mt-6">
              Nenhuma atividade encontrada
            </p>
          )}

        </div>

        {/* ================= VER MAIS ================= */}
        {datas.length > 2 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVerMais(!verMais)}
              className="px-6 py-2 cursor-pointer bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400"
            >
              {verMais ? "Ver Menos" : "Ver Mais"}
            </button>
          </div>
        )}

      </SuperAdminLayout>
    </>
  );
}
