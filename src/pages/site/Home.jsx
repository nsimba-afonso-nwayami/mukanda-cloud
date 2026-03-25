import WhatsAppButton from "../../components/whatsapp/WhatsAppButton";

import Hero from "../../components/home/Hero";
import QuemSomos from "../../components/home/QuemSomos";
import ComoFunciona from "../../components/home/ComoFunciona";
import Precos from "../../components/home/Precos";
import Faq from "../../components/home/Faq";
import Contato from "../../components/home/Contato";
import Cta from "../../components/home/Cta";

export default function Home() {
  return (
    <>
      <title>Mukanda Cloud</title>

      <Hero />
      <QuemSomos />
      <ComoFunciona />
      <Precos />
      <Faq />
      <Contato />
      <Cta />

      {/* Botão WhatsApp fixo */}
      <WhatsAppButton phone="244972614886" size={64} />
    </>
  );
}
