import { Link } from "react-router-dom";
import Sobre from "../../assets/img/quem-somos.jpg";

export default function QuemSomos() {
  return (
    <section id="quem-somos" className="relative bg-slate-900 py-24 px-6 overflow-hidden">
      
      {/* Shape Divider no Topo (Transição Suave de Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 z-10">
        <svg 
          className="relative block w-full h-15 md:h-22.5" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          {/* IMPORTANTE: O fill="#020617" deve ser exatamente a cor da seção ANTERIOR (ex: slate-950) */}
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V0H1200V92.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="#020617" 
            opacity="0.9" // Leve opacidade para suavizar a transição
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-20 pt-16 md:pt-24">

        {/* Imagem Premium com Tridimensionalidade */}
        <div className="w-full md:w-1/2 group">
          <div className="relative overflow-hidden rounded-3xl border-4 border-blue-900/30 transition-transform duration-500 hover:scale-[1.03] shadow-2xl shadow-slate-950/50">
            <img
              src={Sobre}
              alt="Quem Somos - Mukanda Cloud"
              className="w-full h-auto object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay sutil de luz na imagem */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Decoração sutil de fundo (Glow) */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Texto Premium e Hierarquia */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          
          {/* Badge Superior */}
          <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.25em] mb-3 animate-fadeIn">
            Nossa Visão
          </span>

          {/* Título Ajustado (Seguindo o Padrão do Hero) */}
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            A Sua <span className="text-cyan-500">Gestão</span>, <br />Elevada à Nuvem
          </h2>

          <div className="space-y-4">
            <p className="text-slate-300 text-lg leading-relaxed font-light">
              A **Mukanda Cloud** não é apenas uma plataforma; é o parceiro tecnológico estratégico para a modernização do seu negócio.
            </p>
            <p className="text-slate-400 text-base leading-relaxed font-light">
              Simplificamos a administração unificando faturação, gestão de clientes e relatórios inteligentes em um ecossistema cloud simples, eficiente e inquestionavelmente seguro.
            </p>
          </div>

          <Link
            to="/#como-funciona"
            className="
              inline-block mt-8 px-8 py-3.5
              bg-cyan-500 text-slate-950 font-bold rounded-full
              hover:bg-cyan-300 transition-all duration-300
              shadow-[0_8px_20px_-8px_rgba(6,182,212,0.5)]
              hover:shadow-[0_12px_24px_-8px_rgba(6,182,212,0.6)]
              transform hover:-translate-y-1
            "
          >
            Saber Mais
          </Link>
        </div>
      </div>
    </section>
  );
}