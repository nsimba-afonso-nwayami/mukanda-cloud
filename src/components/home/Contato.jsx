export default function Contato() {
  const contactInfo = [
    { icon: "fa-envelope", label: "Email", value: "suporte@mukanda.cloud" },
    { icon: "fa-phone", label: "Telefone", value: "+244 9XX XXX XXX" },
    { icon: "fa-location-dot", label: "Endereço", value: "Luanda, Angola" }
  ];

  return (
    <section id="contato" className="relative bg-slate-900 py-32 overflow-hidden">
      
      {/* Shape Divider Superior - Waves Opacity (Igual ao Hero/Workflow) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180 leading-0 z-20 pointer-events-none opacity-30">
        <svg className="relative block w-full h-16 md:h-24" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path id="wave-path-contact" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax-waves">
            <use href="#wave-path-contact" x="48" y="0" fill="rgba(6, 182, 212, 0.15)" className="animate-[wave_12s_linear_infinite]" />
            <use href="#wave-path-contact" x="48" y="5" fill="rgba(6, 182, 212, 0.05)" className="animate-[wave_18s_linear_infinite]" />
          </g>
        </svg>
      </div>

      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-20 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-md bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em]">
            Conecte-se Conosco
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Estamos a um <span className="text-cyan-500">clique</span> de distância
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Dúvidas técnicas ou propostas comerciais? Nossa equipe está pronta para responder em tempo recorde.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Coluna 1: Info e Redes Sociais */}
          <div className="w-full lg:w-1/3 space-y-12">
            <div className="space-y-10">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 flex items-center justify-center rounded-md bg-slate-950 border border-blue-900/30 group-hover:border-cyan-500/50 transition-all duration-300 shadow-xl">
                    <i className={`fas ${item.icon} text-cyan-500 text-xl drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]`}></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{item.label}</p>
                    <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/5">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-6 font-bold">Siga a Mukanda Cloud</p>
              <div className="flex gap-4">
                {["fa-linkedin-in", "fa-instagram", "fa-facebook-f"].map((social, i) => (
                  <a key={i} href="#" className="w-11 h-11 flex items-center justify-center rounded-md bg-slate-950 border border-white/5 text-slate-400 hover:text-cyan-500 hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300">
                    <i className={`fab ${social}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna 2: Formulário com Bordas Ajustadas (rounded-lg e rounded-md) */}
          <form className="w-full lg:flex-1 bg-slate-950/40 backdrop-blur-xl rounded-lg p-8 md:p-12 border border-blue-900/10 shadow-2xl space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-1 font-bold uppercase tracking-widest">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu Nome"
                  className="w-full px-5 py-4 rounded-md bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-1 font-bold uppercase tracking-widest">E-mail Corporativo</label>
                <input
                  type="email"
                  placeholder="exemplo@empresa.com"
                  className="w-full px-5 py-4 rounded-md bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-1 font-bold uppercase tracking-widest">Telefone</label>
                <input
                  type="text"
                  placeholder="+244"
                  className="w-full px-5 py-4 rounded-md bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-1 font-bold uppercase tracking-widest">Assunto</label>
                <input
                  type="text"
                  placeholder="Ex: Consultoria"
                  className="w-full px-5 py-4 rounded-md bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 ml-1 font-bold uppercase tracking-widest">Mensagem</label>
              <textarea
                placeholder="Como podemos ajudar o seu negócio?"
                rows={4}
                className="w-full px-5 py-4 rounded-md bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 outline-none transition-all resize-none placeholder:text-slate-700"
              ></textarea>
            </div>

            <button
              type="button"
              className="w-full py-4 bg-cyan-500 text-slate-950 font-black rounded-md hover:bg-cyan-300 hover:shadow-[0_10px_30px_-5px_rgba(6,182,212,0.4)] transition-all duration-300 uppercase tracking-widest text-xs"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>

        {/* Mapa com Bordas Ajustadas (rounded-lg) */}
        <div className="mt-24 w-full h-96 rounded-lg overflow-hidden shadow-2xl border border-white/5 relative group">
          <iframe
            title="Mapa Mukanda Cloud"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126154.516584281!2d13.1593976!3d-8.83083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f15195d6893d%3A0x70cfe977c53da061!2sLuanda%2C%20Angola!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            className="border-0 filter grayscale invert contrast-[1.1] opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
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