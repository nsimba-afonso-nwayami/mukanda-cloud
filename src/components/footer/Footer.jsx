import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Estilo refinado para os links (sem arredondamentos, apenas movimento)
  const footerLinkStyle = "text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all duration-300 w-fit font-medium";

  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-blue-900/30 overflow-hidden">
      
      {/* Linha de luz superior (Glow sutil técnico) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

          {/* Branding & Bio */}
          <div className="md:col-span-4 space-y-8">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter text-cyan-500 hover:text-cyan-300 transition-all drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            >
              Mukanda<span className="text-blue-700">.</span>Cloud
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
              Elevando a gestão empresarial ao próximo nível com tecnologia cloud de alta performance e simplicidade industrial em Angola.
            </p>
            
            {/* Redes Sociais - Cantos Sóbrios (rounded-md) */}
            <div className="flex items-center gap-3">
              {['facebook-f', 'linkedin-in', 'instagram', 'x-twitter'].map((social) => (
                <a 
                  key={social} 
                  href={`#${social}`} 
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-slate-900 border border-white/5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <i className={`fab fa-${social} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Coluna Única de Navegação: Soluções & Suporte */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em]">Soluções Cloud</h3>
              <Link to="/#como-funciona" className={footerLinkStyle}>Fluxo de Trabalho</Link>
              <Link to="/#funcionalidades" className={footerLinkStyle}>Funcionalidades</Link>
            </div>
            
            <div className="flex flex-col gap-4 pt-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em]">Suporte Direto</h3>
              <Link to="/#contato" className={footerLinkStyle}>Central de Contacto</Link>
              <a href="mailto:suporte@mukanda.cloud" className={footerLinkStyle}>suporte@mukanda.cloud</a>
            </div>
          </div>

          {/* CTA Card - Cantos Sóbrios (rounded-lg e rounded-md) */}
          <div className="md:col-span-4 bg-slate-900/40 border border-white/5 p-8 rounded-lg backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rotate-45 translate-x-8 -translate-y-8 border-l border-white/5" />
            
            <h3 className="text-white font-bold mb-2 tracking-tight">Pronto para escalar?</h3>
            <p className="text-[10px] text-slate-500 mb-8 font-bold uppercase tracking-widest">Modernize sua gestão hoje.</p>
            
            <div className="flex flex-col gap-4">
              <Link
                to="/criar-conta"
                className="w-full bg-cyan-500 text-slate-950 px-6 py-3.5 rounded-md font-black text-xs uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-[0_8px_20px_-8px_rgba(6,182,212,0.5)] text-center"
              >
                Criar Conta Grátis
              </Link>
              
              <Link
                to="/login"
                className="w-full text-center border border-white/10 text-slate-300 px-6 py-3.5 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Aceder ao Painel
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              © {currentYear} Mukanda Cloud.
            </p>
            <div className="flex gap-6">
              <Link to="/termos" className="text-[10px] text-slate-600 hover:text-cyan-400 transition uppercase tracking-widest font-bold">Termos</Link>
              <Link to="/politica-privacidade" className="text-[10px] text-slate-600 hover:text-cyan-400 transition uppercase tracking-widest font-bold">Privacidade</Link>
            </div>
          </div>
          
          {/* Status - Cantos Sóbrios (rounded-md) */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-md bg-slate-900 border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black italic">Sistemas Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
}