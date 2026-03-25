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
      {/* Background Decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-blue-900/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em]">
            Investimento
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Planos Transparentes
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Sem taxas ocultas. Escolha o poder de processamento que seu negócio exige hoje.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-500 group ${
                plano.popular 
                  ? "bg-slate-900 border-2 border-cyan-500 shadow-[0_20px_50px_rgba(6,182,212,0.15)] scale-105 z-20 py-12" 
                  : "bg-slate-900/40 border border-blue-900/30 hover:border-blue-700/50 z-10"
              }`}
            >
              {/* Badge Popular */}
              {plano.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-cyan-500/40">
                  Mais Recomendado
                </div>
              )}

              <div className="mb-8 text-center md:text-left">
                <h3 className="text-white text-xl font-bold mb-2">{plano.name}</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed min-h-10">
                  {plano.description}
                </p>
              </div>

              {/* Preço */}
              <div className="mb-8 text-center md:text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-400 text-sm font-medium">Kz</span>
                  <span className={`text-4xl md:text-5xl font-black tracking-tight ${plano.popular ? "text-cyan-500" : "text-white"}`}>
                    {plano.price}
                  </span>
                  <span className="text-slate-500 text-sm">/mês</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-10 grow">
                {plano.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plano.popular ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-500"}`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-light">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Botão */}
              <Link
                to="/criar-conta"
                className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${
                  plano.popular
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_10px_20px_-5px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {plano.price === "0" ? "Começar Grátis" : "Assinar Agora"}
              </Link>
            </div>
          ))}
        </div>

        {/* Nota de rodapé sutil */}
        <p className="mt-12 text-center text-slate-500 text-xs">
          Preços em Kwanzas (AOA). Precisa de um plano personalizado? <Link to="/contacto" className="text-cyan-500 hover:underline">Fale conosco</Link>.
        </p>
      </div>
    </section>
  );
}