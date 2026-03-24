import WhatsAppButton from "../../components/whatsapp/WhatsAppButton";

export default function Home() {
  return (
    <>
      <title>Mukanda Cloud</title>

      {/* Botão WhatsApp fixo */}
      <WhatsAppButton phone="244972614886" size={64} />
    </>
  );
}
