import WhatsAppButton from "../../components/whatsapp/WhatsAppButton";

import Hero from "../../components/home/Hero";
import ComoFunciona from "../../components/home/ComoFunciona";
import Contato from "../../components/home/Contato";
import Cta from "../../components/home/Cta";

export default function Home() {
  return (
    <>
      <title>Mukanda Cloud</title>

      <Hero />
      <ComoFunciona />
      <Contato />
      <Cta />

      {/* Botão WhatsApp fixo */}
      <WhatsAppButton phone="244972614886" size={64} />
    </>
  );
}
