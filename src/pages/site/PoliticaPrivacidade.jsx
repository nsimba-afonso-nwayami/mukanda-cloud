import { Link } from "react-router-dom";

export default function PoliticaPrivacidade() {
  return (
    <>
      <title>Políticas de Privacidade | Mukanda Cloud</title>

      <section className="bg-slate-950 min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-6 text-slate-300">

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-black text-cyan-500 mb-8 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            Políticas de Privacidade
          </h1>

          {/* Seções */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">1. Introdução</h2>
            <p className="leading-relaxed">
              Esta política descreve como a Mukanda Cloud coleta, usa e protege seus dados pessoais ao utilizar nossa plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">2. Coleta de Dados</h2>
            <p className="leading-relaxed">
              Coletamos informações fornecidas pelo usuário, como nome, email, telefone e mensagens enviadas através da plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">3. Uso de Dados</h2>
            <p className="leading-relaxed">
              Os dados coletados são utilizados para prestar nossos serviços, enviar informações importantes e melhorar a experiência do usuário.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">4. Compartilhamento de Dados</h2>
            <p className="leading-relaxed">
              Não vendemos ou compartilhamos seus dados com terceiros sem consentimento, exceto quando exigido por lei.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">5. Segurança</h2>
            <p className="leading-relaxed">
              Adotamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração ou destruição.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-500 mb-2">6. Contato</h2>
            <p className="leading-relaxed">
              Em caso de dúvidas sobre nossa política de privacidade, entre em contato através da nossa <Link to="/#contato" className="text-cyan-500 hover:text-cyan-300">página de contato</Link>.
            </p>
          </section>

        </div>
      </section>
    </>
  );
}