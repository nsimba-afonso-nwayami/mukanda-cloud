import { Link } from "react-router-dom";

export default function Termos() {
  return (
    <>
      <title>Termos de Uso | Mukanda Cloud</title>

      <section className="bg-slate-950 min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-6 text-slate-300">

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-black text-cyan-500 mb-8 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            Termos de Uso
          </h1>

          {/* Seções */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">1. Introdução</h2>
            <p className="leading-relaxed">
              Estes Termos de Uso regem a utilização da plataforma Mukanda Cloud. Ao acessar ou usar nossos serviços, você concorda com estes termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">2. Uso do Serviço</h2>
            <p className="leading-relaxed">
              O usuário concorda em utilizar os serviços apenas para fins legais e de acordo com todas as leis aplicáveis. É proibido uso indevido ou tentativa de violar a segurança da plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">3. Responsabilidades</h2>
            <p className="leading-relaxed">
              A Mukanda Cloud não se responsabiliza por perdas indiretas, danos ou falhas decorrentes do uso da plataforma. O usuário é responsável pelo conteúdo que publica.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">4. Política de Conteúdo</h2>
            <p className="leading-relaxed">
              Conteúdos ofensivos, ilegais ou que violem direitos de terceiros não são permitidos. Reservamo-nos o direito de remover qualquer conteúdo que infrinja estas diretrizes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">5. Alterações</h2>
            <p className="leading-relaxed">
              A Mukanda Cloud pode atualizar estes termos a qualquer momento. Recomendamos que revise esta página regularmente. O uso contínuo da plataforma constitui aceitação das alterações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">6. Contato</h2>
            <p className="leading-relaxed">
              Para dúvidas sobre os Termos de Uso, entre em contato conosco através da nossa <Link to="/#contato" className="text-cyan-500 hover:text-cyan-300">página de contato</Link>.
            </p>
          </section>

        </div>
      </section>
    </>
  );
}