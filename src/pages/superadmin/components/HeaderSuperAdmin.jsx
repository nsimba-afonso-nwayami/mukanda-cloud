import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function HeaderSuperAdmin({ sidebarOpen, setSidebarOpen, title }) {
  const { user } = useAuth();
  
  return (
    <header
      className="
        bg-slate-950/80 backdrop-blur-xl
        border-b border-blue-900/30
        fixed top-0 right-0 left-0 md:left-64
        h-16 flex items-center justify-between
        px-4 sm:px-6
        z-30
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Botão mobile */}
        <button
          className="md:hidden text-2xl text-slate-400 hover:text-cyan-300 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Título */}
        <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
          {title}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Nome do usuário */}
        <div className="text-right hidden sm:block">
          <p className="text-xs text-white font-semibold">
            {user?.name || "Usuário"}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
            {user?.role}
          </p>
        </div>

        {/* Avatar */}
        <Link
          to="/dashboard/superadmin/configuracoes"
          className="
            w-9 h-9
            bg-slate-900 border border-blue-900/40
            rounded-full flex items-center justify-center
            hover:border-cyan-500
            hover:shadow-[0_0_12px_rgba(6,182,212,0.5)]
            transition-all duration-300
          "
        >
          <span className="text-cyan-500 text-xs font-bold">
            {user?.initials || "MC"}
          </span>
        </Link>
      </div>
    </header>
  );
}