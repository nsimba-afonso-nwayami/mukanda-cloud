import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Estilos reutilizáveis para os links do menu
  const navLinkStyles = "relative font-medium text-slate-300 hover:text-cyan-300 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-cyan-500 after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo com Glow suave */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter text-cyan-500 hover:text-cyan-300 transition-all drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        >
          Mukanda<span className="text-blue-700">.</span>Cloud
        </Link>

        {/* Botão Mobile - Ícones animados (opcional: trocar por SVGs para mais refinamento) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-cyan-500 text-2xl p-2 hover:bg-blue-900/20 rounded-lg transition"
        >
          <i className={open ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        {/* Navegação */}
        <nav
          className={`
            absolute md:static top-18 left-0 w-full md:w-auto
            bg-slate-950/95 md:bg-transparent
            flex flex-col md:flex-row items-center
            gap-6 md:gap-8
            px-8 md:px-0 py-8 md:py-0
            border-b md:border-0 border-blue-900/30
            transition-all duration-500 ease-in-out
            ${open 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 -translate-y-10 scale-95 pointer-events-none md:opacity-100 md:translate-y-0 md:scale-100 md:pointer-events-auto"
            }
          `}
        >
          <Link to="/" onClick={() => setOpen(false)} className={navLinkStyles}>
            Início
          </Link>
          <Link to="/quem-somos" onClick={() => setOpen(false)} className={navLinkStyles}>
            Quem Somos
          </Link>
          <Link to="/#como-funciona" onClick={() => setOpen(false)} className={navLinkStyles}>
            Como Funciona
          </Link>
          <Link to="/#precos" onClick={() => setOpen(false)} className={navLinkStyles}>
            Preços
          </Link>
          <Link to="/#faq" onClick={() => setOpen(false)} className={navLinkStyles}>
            FAQ
          </Link>
          <Link to="/#contato" onClick={() => setOpen(false)} className={navLinkStyles}>
            Contato
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-0 border-blue-900/50">
            {/* Login - Estilo Ghost */}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="w-full md:w-auto px-6 py-2 text-sm font-bold uppercase tracking-wider text-cyan-500 border border-cyan-500/30 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500 transition-all text-center"
            >
              Entrar
            </Link>

            {/* CTA Principal - Efeito Neon */}
            <Link
              to="/criar-conta"
              onClick={() => setOpen(false)}
              className="
                w-full md:w-auto
                px-6 py-2.5
                text-sm font-bold uppercase tracking-wider
                bg-cyan-500 text-slate-950
                rounded-full
                hover:bg-cyan-300
                hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]
                transition-all duration-300
                text-center
              "
            >
              Criar Conta
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}