import { useState } from "react";

export default function Faq() {
  const faqs = [
    {
      id: 1,
      question: "O que é a Mukanda Cloud?",
      answer: "A Mukanda Cloud é um ecossistema digital inteligente desenhado para modernizar a gestão empresarial. Centralizamos faturação legal, controle de estoque, gestão de clientes e análises financeiras em uma infraestrutura cloud de alta performance.",
    },
    {
      id: 2,
      question: "Posso mudar de plano a qualquer momento?",
      answer: "Com certeza. A nossa plataforma é flexível: você pode realizar o upgrade ou downgrade do seu plano instantaneamente através do painel administrativo, ajustando os recursos conforme o crescimento do seu negócio.",
    },
    {
      id: 3,
      question: "Como funciona o suporte técnico?",
      answer: "Contamos com uma equipe de especialistas pronta para ajudar. Oferecemos suporte multicanal (E-mail, Chat e WhatsApp). Nos planos profissionais e enterprise, você conta com atendimento prioritário e gerentes de conta dedicados.",
    },
    {
      id: 4,
      question: "Os meus dados estão seguros?",
      answer: "A segurança é o nosso pilar. Utilizamos criptografia de nível bancário (SSL), backups diários automáticos e servidores distribuídos geograficamente para garantir que as informações da sua empresa estejam sempre protegidas e acessíveis.",
    },
  ];

  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative bg-slate-900 py-24 overflow-hidden">
      
      {/* Glows de fundo para profundidade */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em]">
            Dúvidas Comuns
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Perguntas <span className="text-cyan-500">Frequentes</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Esclareça suas dúvidas técnicas e comerciais sobre nossa operação cloud.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`group overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isOpen 
                    ? "bg-slate-950 border-cyan-500/50 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.2)]" 
                    : "bg-slate-950/40 border-blue-900/20 hover:border-blue-700/40"
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full cursor-pointer flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <h3 className={`text-lg font-bold pr-8 transition-colors duration-300 ${isOpen ? "text-cyan-400" : "text-white group-hover:text-cyan-200"}`}>
                    {faq.question}
                  </h3>
                  
                  {/* Ícone FontAwesome com Rotação Suave */}
                  <div className={`shrink-0 w-8 h-8 cursor-pointer flex items-center justify-center rounded-full bg-blue-900/20 border border-blue-700/20 transition-all duration-500 ${isOpen ? "rotate-180 bg-cyan-500/20 border-cyan-500/40" : ""}`}>
                    <i className={`fas fa-chevron-down text-sm transition-colors duration-500 ${isOpen ? "text-cyan-400" : "text-slate-500"}`}></i>
                  </div>
                </button>

                {/* Resposta Animada */}
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 text-slate-400 font-light leading-relaxed border-t border-white/5 flex gap-4">
                    {/* Indicador de Resposta Sutil */}
                    <div className="w-1 bg-cyan-500/30 rounded-full my-1 shrink-0" />
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            Ainda tem dúvidas? 
            <a href="/#contato" className="ml-2 text-cyan-500 font-bold hover:text-cyan-400 transition-colors underline decoration-cyan-500/30 underline-offset-4 decoration-2">
              <i className="fas fa-headset mr-2"></i>Fale com um especialista
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}