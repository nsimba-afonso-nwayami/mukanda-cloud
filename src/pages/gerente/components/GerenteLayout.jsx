import { useState } from "react";
import SidebarGerente from "./SidebarGerente";
import HeaderGerente from "./HeaderGerente";

export default function GerenteLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-300 relative overflow-hidden">
      
      {/* Glow de fundo (opcional mas MUITO bom) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <SidebarGerente
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Conteúdo */}
      <div className="flex-1 md:ml-64 flex flex-col overflow-x-hidden relative z-10">
        
        {/* Header */}
        <HeaderGerente
          title={title}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main */}
        <main
          className="
            mt-20
            px-4 sm:px-6 lg:px-8
            py-6
            space-y-8 sm:space-y-10
            max-w-7xl
            w-full
            mx-auto
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}