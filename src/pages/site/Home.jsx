import WhatsAppButton from "../../components/whatsapp/WhatsAppButton";

import Hero from "../../components/home/Hero";
import QuemSomos from "../../components/home/QuemSomos";
import ComoFunciona from "../../components/home/ComoFunciona";

export default function Home() {
  return (
    <>
      <title>Mukanda Cloud</title>

      <Hero />
      <QuemSomos />
      <ComoFunciona />

      {/* Botão WhatsApp fixo */}
      <WhatsAppButton phone="244972614886" size={64} />
    </>
  );
}
