import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <title>Página não encontrada | Mukanda Cloud</title>

      <section className="relative bg-slate-950 min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        
        {/* Grid de Perspectiva (Efeito Cyber/Cloud) */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`, perspective: '500px', backgroundSize: '40px 40px', transform: 'rotateX(60deg) translateY(-100px)' }}>
        </div>

        {/* Glows de Fundo Ambientes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full" />

        <div className="relative z-10 space-y-8">

          {/* 404 Monumental com Efeito de Sombra Projetada */}
          <div className="relative inline-block">
             <h1 className="text-8xl md:text-[12rem] font-black text-white leading-none tracking-tighter opacity-10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-7xl md:text-9xl font-black text-cyan-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                404
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Página Fora de Órbita
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto font-light leading-relaxed">
              O recurso que você procura foi movido ou não existe mais na infraestrutura da <span className="text-cyan-500 font-medium">Mukanda Cloud</span>.
            </p>
          </div>

          {/* Botão Padronizado (rounded-xl e text-sm) */}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-block px-10 py-4 bg-cyan-500 text-slate-950 font-black rounded-xl hover:bg-cyan-300 hover:shadow-[0_15px_35px_-10px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-widest text-sm"
            >
              Restabelecer Conexão
            </Link>
          </div>

        </div>

        {/* Footer da Página 404 */}
        <div className="absolute bottom-10 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
          Mukanda Cloud Infrastructure © 2026
        </div>
      </section>
    </>
  );
}