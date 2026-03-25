import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitora a rolagem da página
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkStyles = "relative text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-400 transition-colors duration-300";

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4" 
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-black tracking-tighter text-white hover:text-cyan-500 transition-all flex items-center gap-2"
        >
          <i className={`fas fa-cloud text-cyan-500 text-lg transition-transform duration-500 ${scrolled ? "scale-90" : "scale-110"}`}></i>
          <span className="group">
            MUKANDA<span className="text-cyan-500 transition-all group-hover:px-1">.</span>CLOUD
          </span>
        </Link>

        {/* Botão Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-cyan-500 text-xl p-2 hover:bg-white/5 rounded-md transition"
        >
          <i className={open ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        {/* Navegação */}
        <nav
          className={`
            absolute md:static top-full left-0 w-full md:w-auto
            bg-slate-950/98 md:bg-transparent
            flex flex-col md:flex-row items-center
            gap-8 md:gap-10
            px-8 md:px-0 py-10 md:py-0
            border-b md:border-0 border-white/5
            transition-all duration-300
            ${open 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 -translate-y-4 pointer-events-none md:opacity-100 md:translate-y-0 md:pointer-events-auto"
            }
          `}
        >
          <Link to="/" onClick={() => setOpen(false)} className={navLinkStyles}>
            Início
          </Link>
          <HashLink to="/#como-funciona" onClick={() => setOpen(false)} className={navLinkStyles}>
            Como Funciona
          </HashLink>
          <HashLink to="/#contato" onClick={() => setOpen(false)} className={navLinkStyles}>
            Contato
          </HashLink>

          {/* Botão de Login - Cantos Sóbrios */}
          <div className="w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-0 border-white/5">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={`
                block w-full md:w-auto
                px-8 py-2.5
                text-[10px] font-black uppercase tracking-[0.3em]
                rounded-md transition-all duration-400 text-center
                ${scrolled 
                  ? "text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
                  : "text-white border border-white/20 hover:bg-white hover:text-slate-950"
                }
              `}
            >
              Entrar
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}