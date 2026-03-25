import { Link } from "react-router-dom";

export default function RecuperarSenha() {
  return (
    <>
      <title>Recuperar Senha | Mukanda Cloud</title>

      <section className="relative bg-slate-950 min-h-screen flex items-center justify-center px-6 overflow-hidden">
        
        {/* Glows de Fundo */}
        <div className="absolute top-0 right-0 w-100 h-100 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          
          {/* Card Compacto */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-lg p-8 shadow-2xl">
            
            {/* Cabeçalho com Ícone e Título */}
            <div className="flex flex-col items-center mb-8 gap-4">
              <div className="w-12 h-12 bg-slate-950 border border-blue-900/30 rounded-md flex items-center justify-center">
                <i className="fas fa-cloud text-cyan-500 text-lg drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"></i>
              </div>
              <h1 className="text-white font-black tracking-[0.2em] uppercase text-sm">
                Mukanda Cloud
              </h1>
            </div>

            <p className="text-slate-300 text-center mb-6 text-xs">
              Insira seu email para receber o link de recuperação de senha.
            </p>

            <form className="space-y-4">
              {/* Email */}
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-md bg-slate-950/60 text-white border border-blue-900/30 focus:border-cyan-500 outline-none transition-all duration-300 placeholder:text-slate-700"
                />
              </div>

              {/* Botão de Ação */}
              <button
                type="button"
                className="w-full cursor-pointer py-3.5 bg-cyan-500 text-slate-950 font-black rounded-md hover:bg-cyan-300 hover:shadow-[0_8px_20px_-5px_rgba(6,182,212,0.4)] transition-all duration-300 uppercase tracking-widest text-xs mt-2"
              >
                Enviar Link
              </button>
            </form>

            {/* Link Secundário */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <Link to="/login" className="text-[10px] text-slate-400 hover:text-white uppercase font-bold tracking-[0.2em] transition-colors">
                Lembrei minha senha? Entrar
              </Link>
            </div>
          </div>

          {/* Botão de Voltar Minimalista */}
          <div className="text-center mt-6">
            <Link to="/" className="text-slate-600 hover:text-slate-400 text-[9px] font-bold uppercase tracking-[0.4em] transition-all">
              <i className="fas fa-arrow-left mr-2"></i> Voltar
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}