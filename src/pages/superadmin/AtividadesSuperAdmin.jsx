import { useState } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";

export default function AtividadesSuperAdmin() {
  const [atividades, setAtividades] = useState([
    { id: 1, usuario: "João Silva", departamento: "Financeiro", acao: "Criou pasta 'Relatórios'", data: "2026-03-24 10:15" },
    { id: 2, usuario: "Maria Santos", departamento: "RH", acao: "Editou usuário 'Pedro Costa'", data: "2026-03-24 11:30" },
    { id: 3, usuario: "Pedro Costa", departamento: "TI", acao: "Upload de arquivo 'teste.pdf'", data: "2026-03-25 09:45" },
    { id: 4, usuario: "João Silva", departamento: "Financeiro", acao: "Deletou arquivo 'Old_Report.pdf'", data: "2026-03-25 14:10" },
    { id: 5, usuario: "Maria Santos", departamento: "RH", acao: "Criou pasta 'RH Docs'", data: "2026-03-26 08:00" },
    { id: 6, usuario: "Pedro Costa", departamento: "TI", acao: "Editou usuário 'João Silva'", data: "2026-03-26 09:30" },
    { id: 7, usuario: "João Silva", departamento: "Financeiro", acao: "Upload de arquivo 'Relatorio2026.pdf'", data: "2026-03-26 10:45" },
  ]);

  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [verMais, setVerMais] = useState(false);

  const departamentos = ["Financeiro", "RH", "TI"];
  const usuarios = ["João Silva", "Maria Santos", "Pedro Costa"];

  // Filtragem
  const atividadesFiltradas = atividades
    .filter(a => {
      const matchUsuario = filtroUsuario ? a.usuario === filtroUsuario : true;
      const matchDep = filtroDepartamento ? a.departamento === filtroDepartamento : true;
      const matchData = filtroData ? a.data.split(" ")[0] === filtroData : true;
      const matchPesquisa = pesquisa ? a.acao.toLowerCase().includes(pesquisa.toLowerCase()) : true;
      return matchUsuario && matchDep && matchData && matchPesquisa;
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data)); // Decrescente

  // Agrupa por dia
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

        {/* Filtros responsivos */}
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
    {usuarios.map(u => <option key={u} value={u}>{u}</option>)}
  </select>

  <select
    value={filtroDepartamento}
    onChange={(e) => setFiltroDepartamento(e.target.value)}
    className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg w-full md:w-auto"
  >
    <option value="">Todos os departamentos</option>
    {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
  </select>

  <input
    type="date"
    value={filtroData}
    onChange={(e) => setFiltroData(e.target.value)}
    className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg w-full md:w-auto"
  />
</div>

        {/* Lista de atividades */}
        <div className="space-y-6">
          {datasVisiveis.map(dia => (
            <div key={dia}>
              <h3 className="text-slate-400 font-semibold mb-2">{dia}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {atividadesPorDia[dia].map(a => (
                  <div key={a.id} className="bg-slate-900 border border-blue-900 rounded-xl p-4 flex flex-col gap-1">
                    <p className="text-sm text-slate-300 font-semibold truncate">{a.acao}</p>
                    <p className="text-xs text-slate-400 truncate"><strong>Usuário:</strong> {a.usuario}</p>
                    <p className="text-xs text-slate-400 truncate"><strong>Departamento:</strong> {a.departamento}</p>
                    <p className="text-xs text-slate-400"><strong>Hora:</strong> {a.data.split(" ")[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {atividadesFiltradas.length === 0 && (
            <p className="text-slate-400 text-center mt-6">Nenhuma atividade encontrada</p>
          )}
        </div>

        {/* Botão Ver Mais / Ver Menos */}
        {datas.length > 2 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVerMais(!verMais)}
              className="px-6 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400"
            >
              {verMais ? "Ver Menos" : "Ver Mais"}
            </button>
          </div>
        )}

      </SuperAdminLayout>
    </>
  );
}