import { useEffect, useState } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";

// Importação dos Services
import { getLogs } from "../../services/logService";
import { getUsers } from "../../services/userService";
import { getDepartments } from "../../services/departmentService";

export default function AtividadesSuperAdmin() {
  const [atividades, setAtividades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [filtroUsuario, setFiltroUsuario] = useState(""); // Armazenará o EMAIL selecionado
  const [filtroDepartamento, setFiltroDepartamento] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [verMais, setVerMais] = useState(false);

  const [loading, setLoading] = useState(true);

  // Estilo padrão para inputs e selects (mesmo estilo dos seus modais)
  const inputStyle = "p-3 bg-slate-800 border border-blue-900 text-white rounded-lg focus:border-cyan-500 focus:outline-none transition-all";

  /**
   * FETCH DATA (LOGS, USUÁRIOS E DEPARTAMENTOS)
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const [logsData, usersData, deptsData] = await Promise.all([
        getLogs(),
        getUsers(),
        getDepartments(),
      ]);

      const formattedLogs = logsData.map((log) => {
        let dateStr = "";
        
        if (log.timestamp) {
          if (typeof log.timestamp.format === "function") {
            dateStr = log.timestamp.format("YYYY-MM-DD HH:mm:ss");
          } else {
            dateStr = String(log.timestamp);
          }
        }

        return {
          id: log.id,
          usuario: log.user || "Sistema",
          email: log.user_email || log.user || "", // Fallback caso o log use o user como identificador
          departamento: log.target || "-", 
          acao: log.action || "Sem descrição",
          data: dateStr, 
        };
      });

      setAtividades(formattedLogs);
      setUsuarios(usersData);
      setDepartamentos(deptsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * FILTRAGEM (POR EMAIL)
   */
  const atividadesFiltradas = atividades
    .filter((a) => {
      // Alterado para comparar o filtro com o campo email
      const matchUsuario = filtroUsuario ? a.email === filtroUsuario : true;
      const matchDep = filtroDepartamento ? a.departamento === filtroDepartamento : true;
      const matchData = filtroData ? a.data.includes(filtroData) : true;
      const matchPesquisa = pesquisa ? a.acao.toLowerCase().includes(pesquisa.toLowerCase()) : true;

      return matchUsuario && matchDep && matchData && matchPesquisa;
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  /**
   * AGRUPAMENTO POR DIA
   */
  const atividadesPorDia = atividadesFiltradas.reduce((acc, atividade) => {
    const rawData = String(atividade.data || "");
    const dia = rawData.includes(" ") 
      ? rawData.split(" ")[0] 
      : rawData.split("T")[0] || "Data indefinida";

    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(atividade);
    return acc;
  }, {});

  const datas = Object.keys(atividadesPorDia);
  const datasVisiveis = verMais ? datas : datas.slice(0, 2);

  return (
    <>
      <title>Atividades | Mukanda Cloud</title>

      <SuperAdminLayout title="Atividades">

        {/* ================= FILTROS ================= */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-2 mb-6">
          <input
            type="text"
            placeholder="Pesquisar ações..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className={`${inputStyle} flex-1`}
          />

          {/* Filtro por Email */}
          <select
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className={`${inputStyle} w-full md:w-auto`}
          >
            <option value="">Todos os emails</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.email}>
                {u.email}
              </option>
            ))}
          </select>

          <select
            value={filtroDepartamento}
            onChange={(e) => setFiltroDepartamento(e.target.value)}
            className={`${inputStyle} w-full md:w-auto`}
          >
            <option value="">Todos os departamentos</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className={`${inputStyle} w-full md:w-auto`}
          />
        </div>

        {/* ================= LISTA ================= */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <i className="fas fa-spinner fa-spin text-3xl mb-3"></i>
              <p>Carregando registros...</p>
            </div>
          ) : (
            datasVisiveis.map((dia) => (
              <div key={dia}>
                <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-xs"></i>
                  {dia}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {atividadesPorDia[dia].map((a) => (
                    <div
                      key={a.id}
                      className="bg-slate-900 border border-blue-900 rounded-xl p-4 flex flex-col gap-1 hover:border-cyan-500/40 transition-colors"
                    >
                      <p className="text-sm text-slate-200 font-semibold truncate">
                        {a.acao}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        <strong className="text-slate-500">Usuário:</strong> {a.usuario}
                      </p>
                      <p className="text-xs text-slate-500 italic truncate">
                        {a.email}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        <strong className="text-slate-500">Alvo:</strong> {a.departamento}
                      </p>
                      <p className="text-xs text-slate-400">
                        <strong className="text-slate-500">Hora:</strong> {
                          a.data.includes(" ") ? a.data.split(" ")[1] : 
                          a.data.includes("T") ? a.data.split("T")[1].substring(0, 8) : "--:--"
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {!loading && atividadesFiltradas.length === 0 && (
            <div className="text-center py-10">
              <i className="fas fa-history text-slate-600 text-4xl mb-3"></i>
              <p className="text-slate-500">Nenhum registro de atividade encontrado.</p>
            </div>
          )}
        </div>

        {/* ================= PAGINAÇÃO / VER MAIS ================= */}
        {!loading && datas.length > 2 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVerMais(!verMais)}
              className="px-8 py-2 cursor-pointer bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transition-all"
            >
              {verMais ? "Ver Menos" : "Ver Mais Dias"}
            </button>
          </div>
        )}

      </SuperAdminLayout>
    </>
  );
}