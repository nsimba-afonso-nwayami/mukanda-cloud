export default function Contato() {
  const contactInfo = [
    { icon: "fa-envelope", label: "Email", value: "suporte@mukanda.cloud" },
    { icon: "fa-phone", label: "Telefone", value: "+244 9XX XXX XXX" },
    { icon: "fa-location-dot", label: "Endereço", value: "Luanda, Angola" }
  ];

  return (
    <section id="contato" className="relative bg-slate-900 py-24 overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em]">
            Conecte-se Conosco
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Estamos a um <span className="text-cyan-500">clique</span> de distância
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Dúvidas técnicas ou propostas comerciais? Nossa equipe está pronta para responder em tempo recorde.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Coluna 1: Info e Redes Sociais */}
          <div className="w-full lg:w-1/3 space-y-10">
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-950 border border-blue-900/30 group-hover:border-cyan-500/50 transition-all duration-300 shadow-xl">
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
              <p className="text-slate-500 text-sm mb-6 font-medium">Siga a Mukanda Cloud</p>
              <div className="flex gap-4">
                {["fa-linkedin-in", "fa-instagram", "fa-facebook-f"].map((social, i) => (
                  <a key={i} href="#" className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-950 border border-white/5 text-slate-400 hover:text-cyan-500 hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300">
                    <i className={`fab ${social}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna 2: Formulário Premium */}
          <form className="w-full lg:flex-1 bg-slate-950/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-blue-900/20 shadow-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-2 font-bold uppercase tracking-widest">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu Nome"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-2 font-bold uppercase tracking-widest">E-mail Corporativo</label>
                <input
                  type="email"
                  placeholder="exemplo@empresa.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-2 font-bold uppercase tracking-widest">Telefone</label>
                <input
                  type="text"
                  placeholder="+244"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 ml-2 font-bold uppercase tracking-widest">Assunto</label>
                <input
                  type="text"
                  placeholder="Ex: Consultoria"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 ml-2 font-bold uppercase tracking-widest">Mensagem</label>
              <textarea
                placeholder="Como podemos ajudar o seu negócio?"
                rows={4}
                className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 text-white border border-blue-900/30 focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all duration-300 resize-none"
              ></textarea>
            </div>

            {/* Botão sem ícone, focado na tipografia premium */}
            <button
              type="button"
              className="w-full cursor-pointer py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:bg-cyan-300 hover:shadow-[0_10px_30px_-5px_rgba(6,182,212,0.5)] transition-all duration-300 transform active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>

        {/* Mapa Estilizado */}
        <div className="mt-20 w-full h-112.5 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 relative group">
          <iframe
            title="Mapa Mukanda Cloud"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15762.64835695029!2d13.2300!3d-8.8300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f155982!2sLuanda!5e0!3m2!1spt-PT!2sao!4v1625000000000!5m2!1spt-PT!2sao"
            width="100%"
            height="100%"
            className="border-0 filter grayscale invert contrast-[1.1] opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}