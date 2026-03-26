import { Link, useNavigate } from "react-router-dom";

export default function SidebarSuperAdmin({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const linkStyle =
    "flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition font-medium";

  return (
    <>
      <aside
        className={`
          bg-slate-950 border-r border-blue-900/30
          w-64 fixed top-0 left-0 h-screen p-6
          transition-transform duration-300 overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
          z-50 flex flex-col
        `}
      >
        {/* Botão fechar mobile */}
        <button
            className="
                md:hidden
                absolute top-4 right-4 z-50
                text-2xl text-slate-400
                hover:text-cyan-300
                transition
            "
            onClick={() => setSidebarOpen(false)}
            >
            <i className="fas fa-times"></i>
        </button>

        {/* Cabeçalho */}
        <div className="flex-1">
          <h1 className="text-xl font-black tracking-tight text-cyan-500 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]">
            Mukanda<span className="text-blue-700">.</span>Cloud
          </h1>

          <p className="text-xs text-slate-500 mt-1 mb-8 uppercase tracking-wider">
            Painel Administrativo
          </p>

          {/* Navegação */}
          <nav className="space-y-2 text-sm">

            <Link to="/dashboard/superadmin" className={linkStyle}>
              <i className="fas fa-gauge-high text-blue-700"></i>
              Dashboard
            </Link>

            <Link to="/dashboard/superadmin/arquivos" className={linkStyle}>
              <i className="fas fa-folder text-blue-700"></i>
              Arquivos
            </Link>

            <Link to="/dashboard/superadmin/departamentos" className={linkStyle}>
              <i className="fas fa-building text-blue-700"></i>
              Departamentos
            </Link>

            <Link to="/dashboard/superadmin/equipa" className={linkStyle}>
              <i className="fas fa-users text-blue-700"></i>
              Equipa
            </Link>

            <Link to="/dashboard/superadmin/permissoes" className={linkStyle}>
              <i className="fas fa-shield-alt text-blue-700"></i>
              Permissões
            </Link>

            <Link to="/dashboard/superadmin/atividades" className={linkStyle}>
              <i className="fas fa-clock-rotate-left text-blue-700"></i>
              Atividades
            </Link>

            <Link to="/dashboard/superadmin/configuracoes" className={linkStyle}>
              <i className="fas fa-cogs text-blue-700"></i>
              Configurações
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-blue-900/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 cursor-pointer w-full p-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition font-semibold"
          >
            <i className="fas fa-sign-out-alt"></i>
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}