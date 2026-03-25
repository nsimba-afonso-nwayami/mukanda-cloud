import { Link } from "react-router-dom";

export default function Cta() {
  return (
    <section className="relative bg-slate-950 py-24 overflow-hidden">
      
      {/* Glows de Fundo Coerentes com as outras seções */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        {/* Container em Vidro (Glassmorphism) */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-900/20 rounded-[2.5rem] p-12 md:p-20 shadow-2xl">
          
          <span className="inline-block px-4 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em] mb-6">
            Pronto para o Próximo Nível?
          </span>

          {/* Título - Ajustado para 4xl (Igual às outras seções) */}
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            Comece a usar a <br />
            <span className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">Mukanda Cloud</span> hoje mesmo.
          </h2>

          {/* Descrição - Ajustada para o padrão text-lg */}
          <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Tenha controle total da sua empresa na nuvem de forma fácil, rápida e segura.
          </p>

          {/* Botões com o mesmo padrão de Border Radius das seções anteriores */}
          <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-6">
            
            {/* CTA Principal */}
            <Link
              to="/criar-conta"
              className="w-full md:w-auto px-10 py-4 bg-cyan-500 text-slate-950 font-bold rounded-2xl hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300 text-center uppercase tracking-wider text-xs"
            >
              Criar Conta Gratuita
            </Link>

            {/* CTA Secundário */}
            <Link
              to="/#como-funciona"
              className="w-full md:w-auto px-10 py-4 border border-cyan-500/30 text-cyan-500 font-bold rounded-2xl hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 text-center uppercase tracking-wider text-xs"
            >
              Ver Como Funciona
            </Link>
          </div>

          {/* Benefícios Rápidos com FontAwesome via CDN */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
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