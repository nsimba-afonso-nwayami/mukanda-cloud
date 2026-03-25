import { Link } from "react-router-dom";

export default function ComoFunciona() {
  const etapas = [
    {
      id: "01",
      iconClass: "fas fa-cloud",
      title: "Plataforma na Nuvem",
      description: "Acesse sua empresa de qualquer lugar, a qualquer hora, com infraestrutura de alta disponibilidade.",
    },
    {
      id: "02",
      iconClass: "fas fa-chart-line",
      title: "Gestão Simplificada",
      description: "Faturação, clientes e relatórios automáticos em uma interface desenhada para produtividade.",
    },
    {
      id: "03",
      iconClass: "fas fa-users",
      title: "Equipe Conectada",
      description: "Colaboração em tempo real com controle de permissões e histórico de atividades seguro.",
    },
  ];

  return (
    <section id="como-funciona" className="relative bg-slate-950 py-32 overflow-hidden">
      
      {/* Shape Divider Superior - Waves Opacity */}
      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180 leading-0 z-20 pointer-events-none opacity-40">
        <svg className="relative block w-full h-16 md:h-24" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax-waves">
            <use href="#wave-path" x="48" y="0" fill="rgba(6, 182, 212, 0.1)" className="animate-[wave_10s_linear_infinite]" />
            <use href="#wave-path" x="48" y="3" fill="rgba(6, 182, 212, 0.05)" className="animate-[wave_15s_linear_infinite]" />
          </g>
        </svg>
      </div>

      {/* Glows Decorativos de Fundo */}
      <div className="absolute top-1/4 right-0 w-125 h-125 bg-blue-900/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 left-0 w-125 h-125 bg-cyan-500/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-30">
        
        {/* Cabeçalho da Seção */}
        <div className="space-y-4 mb-20">
          <span className="inline-block px-4 py-1.5 rounded-md bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em]">
            Workflow Inteligente
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Como a <span className="text-cyan-500">Mukanda</span> Funciona
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Transformamos processos complexos em uma jornada digital fluida para o crescimento do seu negócio.
          </p>
        </div>

        {/* Grid de Etapas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {etapas.map((etapa) => (
            <div
              key={etapa.id}
              className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-lg p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/40 hover:bg-slate-900/60 shadow-2xl overflow-hidden"
            >
              {/* Número da Etapa Sutil */}
              <span className="absolute top-6 right-8 text-4xl font-black text-white/5 group-hover:text-cyan-500/10 transition-colors duration-500 italic">
                {etapa.id}
              </span>

              {/* Container do Ícone com Cantos Sóbrios (rounded-md) */}
              <div className="w-20 h-20 mb-8 flex items-center justify-center rounded-md bg-slate-950 border border-blue-900/30 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500">
                <i className={`${etapa.iconClass} text-cyan-500 text-3xl transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]`}></i>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
                {etapa.title}
              </h3>
              
              <p className="text-slate-400 text-base leading-relaxed font-light">
                {etapa.description}
              </p>

              {/* Detalhe de Brilho Lateral (Estilo Industrial) */}
              <div className="absolute top-0 left-0 w-1 h-0 bg-cyan-500 transition-all duration-500 group-hover:h-1/4" />
            </div>
          ))}
        </div>

        {/* CTA de Fechamento com Cantos Sóbrios (rounded-md) */}
        <div className="mt-24 flex flex-col items-center space-y-6">
          <Link
            to="/login"
            className="px-12 py-4 bg-cyan-500 text-slate-950 text-xs font-black rounded-md hover:bg-cyan-300 hover:shadow-[0_10px_30px_-5px_rgba(6,182,212,0.5)] transition-all duration-300 uppercase tracking-[0.2em]"
          >
            Começar Experiência Grátis
          </Link>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
            Configuração em 2 minutos • Sem custos ocultos
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
      `}} />
    </section>
  );
}