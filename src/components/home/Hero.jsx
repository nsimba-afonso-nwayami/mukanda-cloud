import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Imagens Originais Mantidas
import HeroImg1 from "../../assets/img/hero1.jpg";
import HeroImg2 from "../../assets/img/hero2.jpg";
import HeroImg3 from "../../assets/img/hero3.jpg";

export default function Hero() {
  const slides = [
    { id: 1, tag: "Tecnologia de Ponta", image: HeroImg1, title: "Gestão Empresarial na Nuvem", subtitle: "Controle sua empresa de forma simples, rápida e segura." },
    { id: 2, tag: "Ecossistema Completo", image: HeroImg2, title: "Tudo em Um Só Lugar", subtitle: "Faturação, gestão de clientes e relatórios inteligentes." },
    { id: 3, tag: "Alta Escalabilidade", image: HeroImg3, title: "Escale o Seu Negócio", subtitle: "Liberte o potencial da sua empresa com tecnologia moderna." },
  ];

  return (
    <section className="w-full h-screen relative bg-slate-950 overflow-hidden">
      
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          // Ajustado: Bullets Quadrados (!rounded-none)
          bulletClass: "swiper-pagination-bullet !bg-cyan-500 !opacity-30 !w-3 !h-3 !rounded-none transition-all duration-300 cursor-pointer hover:!opacity-70",
          bulletActiveClass: "!opacity-100 !w-10 !rounded-none" 
        }}
        loop
        className="h-full z-10"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-full relative">
              
              <div className="absolute inset-0 scale-110 animate-[kenburns_20s_ease_infinite]">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              </div>

              <div className="absolute inset-0 bg-linear-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
              
              <div className="absolute inset-0 flex items-center justify-center px-6 z-20">
                <div className="max-w-4xl text-center space-y-5">
                  
                  {/* Tag Superior Ajustada para Cantos Sóbrios (rounded-md) */}
                  <span className="inline-block px-4 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] uppercase font-bold tracking-[0.25em]">
                    {slide.tag}
                  </span>

                  {/* Título Mantido conforme ajuste anterior (text-4xl md:text-5xl e font-bold) */}
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.2] tracking-tight">
                    {slide.title}
                  </h1>

                  <p className="max-w-xl mx-auto text-base md:text-lg text-slate-300/90 font-light leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="pt-8 flex flex-col md:flex-row gap-5 justify-center items-center">
                    
                    {/* Botão Principal Ajustado para Cantos Sóbrios (rounded-md, text-xs e tracking-widest) */}
                    <Link 
                      to="/criar-conta" 
                      className="px-10 py-4 bg-cyan-500 text-slate-950 text-xs font-black rounded-md hover:bg-cyan-300 transition-all shadow-[0_8px_25px_-8px_rgba(6,182,212,0.5)] uppercase tracking-widest"
                    >
                      Começar Agora
                    </Link>
                    
                    {/* Botão Secundário Ajustado para Cantos Sóbrios (rounded-md, text-xs e tracking-widest) */}
                    <Link 
                      to="/#como-funciona" 
                      className="px-10 py-4 border border-white/20 text-white text-xs font-black rounded-md hover:bg-white/5 transition-all backdrop-blur-sm uppercase tracking-widest"
                    >
                      Saber Mais
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Ondas Animadas (Mantenha o SVG original) */}
      <div className="absolute bottom-0 left-0 w-full leading-0 z-30 pointer-events-none">
        <svg className="relative block w-full h-15 md:h-25" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax-waves">
            <use href="#gentle-wave" x="48" y="0" fill="rgba(2, 6, 23, 0.7)" className="animate-[wave_7s_cubic-bezier(.55,.5,.45,.5)_infinite]" />
            <use href="#gentle-wave" x="48" y="3" fill="rgba(2, 6, 23, 0.5)" className="animate-[wave_10s_cubic-bezier(.55,.5,.45,.5)_infinite]" />
            <use href="#gentle-wave" x="48" y="5" fill="rgba(2, 6, 23, 0.3)" className="animate-[wave_13s_cubic-bezier(.55,.5,.45,.5)_infinite]" />
            <use href="#gentle-wave" x="48" y="7" fill="#020617" className="animate-[wave_20s_cubic-bezier(.55,.5,.45,.5)_infinite]" />
          </g>
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kenburns {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes wave {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
        .swiper-pagination {
          bottom: 120px !important;
          z-index: 40 !important;
        }
        @media (max-width: 768px) {
          .swiper-pagination { bottom: 80px !important; }
        }
      `}} />
    </section>
  );
}