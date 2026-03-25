import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Estilo refinado para os links das colunas
  const footerLinkStyle = "text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all duration-300 w-fit";

  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-blue-900/30 mt-24 overflow-hidden">
      {/* Linha de luz superior (Glow sutil) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Branding & Bio */}
          <div className="md:col-span-4 space-y-6">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter text-cyan-500 hover:text-cyan-300 transition-all drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            >
              Mukanda<span className="text-blue-700">.</span>Cloud
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Elevando a gestão empresarial ao próximo nível com tecnologia cloud de alta performance e simplicidade.
            </p>
            
            {/* Redes Sociais */}
            <div className="flex items-center gap-4">
              {['facebook', 'linkedin', 'instagram', 'twitter'].map((social) => (
                <a 
                  key={social} 
                  href={`#${social}`} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900/10 border border-blue-900/20 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Coluna Produto - Sem <ul> ou <li> */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">Produto</h3>
            <Link to="/#como-funciona" className={footerLinkStyle}>Como Funciona</Link>
            <Link to="/#faq" className={footerLinkStyle}>FAQ</Link>
            <Link to="/precos" className={footerLinkStyle}>Preços</Link>
          </div>

          {/* Coluna Empresa - Sem <ul> ou <li> */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">Empresa</h3>
            <Link to="/quem-somos" className={footerLinkStyle}>Sobre nós</Link>
            <Link to="/contato" className={footerLinkStyle}>Contacto</Link>
          </div>

          {/* CTA Card */}
          <div className="md:col-span-4 bg-slate-900/30 border border-blue-900/20 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
            <h3 className="text-white font-bold mb-2">Pronto para escalar?</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Modernize sua gestão hoje mesmo.</p>
            
            <div className="flex flex-col gap-3">
              <Link
                to="/criar-conta"
                className="w-full bg-cyan-500 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all text-center shadow-[0_4px_14px_0_rgba(6,182,212,0.3)]"
              >
                Criar Conta Grátis
              </Link>
              
              <Link
                to="/login"
                className="w-full text-center border border-blue-700/40 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-blue-900/20 transition-all"
              >
                Aceder ao Painel
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-blue-900/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-xs text-slate-500 font-medium">
              © {currentYear} Mukanda Cloud.
            </p>
            <Link to="/termos" className="text-xs text-slate-500 hover:text-cyan-400 transition">Termos</Link>
            <Link to="/privacidade" className="text-xs text-slate-500 hover:text-cyan-400 transition">Privacidade</Link>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold italic">Sistemas Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
}