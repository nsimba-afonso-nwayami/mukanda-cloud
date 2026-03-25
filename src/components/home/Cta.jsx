import { Link } from "react-router-dom";

export default function Cta() {
  return (
    <section className="relative bg-slate-950 py-32 overflow-hidden">
      
      {/* Glow de Fundo Centralizado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        {/* Container em Vidro com Cantos Sóbrios (rounded-lg) */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-lg p-12 md:p-20 shadow-2xl relative overflow-hidden">
          
          {/* Detalhe Técnico de Canto (Opcional, reforça o estilo industrial) */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rotate-45 translate-x-12 -translate-y-12 border-l border-white/10" />

          <span className="inline-block px-4 py-1.5 rounded-md bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em] mb-8">
            Pronto para o Próximo Nível?
          </span>

          {/* Título - Impactante e Sóbrio */}
          <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
            Comece a usar a <br />
            <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">Mukanda Cloud</span> hoje mesmo.
          </h2>

          <p className="mt-8 text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Tenha controle total da sua empresa na nuvem de forma fácil, rápida e segura.
          </p>

          {/* Botões com Cantos Sóbrios (rounded-md) */}
          <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
            
            {/* CTA Principal */}
            <Link
              to="/criar-conta"
              className="w-full md:w-auto px-12 py-4 bg-cyan-500 text-slate-950 text-xs font-black rounded-md hover:bg-cyan-300 hover:shadow-[0_10px_30px_-5px_rgba(6,182,212,0.5)] transition-all duration-300 text-center uppercase tracking-[0.2em]"
            >
              Criar Conta Gratuita
            </Link>

            {/* CTA Secundário */}
            <Link
              to="/#como-funciona"
              className="w-full md:w-auto px-12 py-4 border border-white/20 text-white text-xs font-black rounded-md hover:bg-white/5 hover:border-white/40 transition-all duration-300 text-center uppercase tracking-[0.2em]"
            >
              Ver Como Funciona
            </Link>
          </div>

          {/* Benefícios Rápidos */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2">
              <i className="fas fa-check text-cyan-500"></i> Sem Cartão
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-shield-alt text-cyan-500"></i> 100% Seguro
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-bolt text-cyan-500"></i> Setup Instantâneo
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}