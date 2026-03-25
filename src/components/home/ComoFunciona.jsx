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
    <section id="como-funciona" className="relative bg-slate-950 py-24 overflow-hidden">
      
      {/* Elementos Decorativos de Fundo (Glows) */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-900/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="space-y-4 mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em]">
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
              className="group relative bg-slate-900/40 backdrop-blur-sm border border-blue-900/20 rounded-3xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/40 hover:bg-slate-900/60 shadow-xl"
            >
              {/* Número da Etapa Sutil */}
              <span className="absolute top-6 right-8 text-4xl font-black text-white/5 group-hover:text-cyan-500/10 transition-colors duration-500">
                {etapa.id}
              </span>

              {/* Container do Ícone */}
              <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-blue-900/20 border border-blue-700/20 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all duration-500">
                <i className={`${etapa.iconClass} text-cyan-500 text-3xl transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]`}></i>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
                {etapa.title}
              </h3>
              
              <p className="text-slate-400 text-base leading-relaxed font-light">
                {etapa.description}
              </p>

              {/* Detalhe de Brilho no Hover (Bottom Line) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-500 transition-all duration-500 group-hover:w-1/3 group-hover:shadow-[0_0_10px_#06b6d4]" />
            </div>
          ))}
        </div>

        {/* CTA de Fechamento */}
        <div className="mt-20 flex flex-col items-center space-y-4">
          <Link
            to="/criar-conta"
            className="px-10 py-4 bg-cyan-500 text-slate-950 font-black rounded-full hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:scale-105"
          >
            Começar Experiência Grátis
          </Link>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
            Sem cartão de crédito • Configuração em 2 minutos
          </p>
        </div>
      </div>
    </section>
  );
}