import { Link } from "react-router-dom";

export default function Precos() {
  const planos = [
    {
      id: 1,
      name: "Básico",
      price: "0",
      description: "Ideal para freelancers e pequenos negócios no início.",
      features: ["Faturação básica", "Gestão de clientes", "Suporte via e-mail"],
      popular: false,
    },
    {
      id: 2,
      name: "Profissional",
      price: "12.000",
      description: "A solução completa para empresas em crescimento.",
      features: ["Faturação completa", "Relatórios avançados", "Equipe colaborativa", "Suporte prioritário"],
      popular: true,
    },
    {
      id: 3,
      name: "Enterprise",
      price: "30.000",
      description: "Segurança e performance máxima para grandes volumes.",
      features: ["Tudo do Profissional", "Dashboard personalizado", "Integrações avançadas", "Suporte dedicado 24/7"],
      popular: false,
    },
  ];

  return (
    <section id="precos" className="relative bg-slate-950 py-24 overflow-hidden">
      
      {/* Glow de Fundo Sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Cabeçalho Padronizado (text-3xl md:text-4xl) */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em]">
            Investimento
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Planos <span className="text-cyan-500">Transparentes</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Escolha o poder de processamento que seu negócio exige hoje. Sem taxas ocultas.
          </p>
        </div>

        {/* Grid com Gap corrigido para Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-8 items-stretch">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className={`relative flex flex-col p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 group ${
                plano.popular 
                  ? "bg-slate-900 border-2 border-cyan-500/50 shadow-[0_20px_50px_rgba(6,182,212,0.15)] md:scale-105 z-20 py-12" 
                  : "bg-slate-900/40 border border-blue-900/20 hover:border-blue-700/40 z-10"
              }`}
            >
              {/* Badge Popular */}
              {plano.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                  Mais Recomendado
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="text-white text-xl font-bold mb-3 uppercase tracking-wider">{plano.name}</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed min-h-10">
                  {plano.description}
                </p>
              </div>

              {/* Preço com Hierarquia Clara */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-slate-500 text-sm font-bold self-start mt-2">Kz</span>
                  <span className={`text-5xl font-black tracking-tighter ${plano.popular ? "text-cyan-500" : "text-white"}`}>
                    {plano.price}
                  </span>
                  <span className="text-slate-500 text-xs font-medium self-end mb-2">/mês</span>
                </div>
              </div>

              {/* Lista de Funcionalidades */}
              <div className="space-y-4 mb-10 grow">
                {plano.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <i className={`fas fa-check-circle mt-1 shrink-0 ${plano.popular ? "text-cyan-500" : "text-blue-900"}`}></i>
                    <span className="font-light leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Botão Padronizado (Tamanho ajustado para text-sm/base) */}
              <Link
                to="/criar-conta"
                className={`w-full py-4 rounded-2xl font-black text-center transition-all duration-300 uppercase tracking-widest text-sm ${
                  plano.popular
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-300 shadow-[0_10px_20px_-5px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {plano.price === "0" ? "Começar Grátis" : "Assinar Agora"}
              </Link>
            </div>
          ))}
        </div>

        {/* Nota de Rodapé Sutil */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-xs font-medium">
            Preços em Kwanzas (AOA). Precisa de uma solução customizada? 
            <Link to="/contacto" className="ml-2 text-cyan-500 font-bold hover:text-cyan-400 transition-colors underline underline-offset-4 decoration-cyan-500/30">
              Solicitar Proposta
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}