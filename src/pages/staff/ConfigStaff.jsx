import { useState } from "react";
import StaffLayout from "./components/StaffLayout";
import ModalSmall from "./components/ModalSmall";

export default function ConfigStaff() {
  // Dados do superadmin
  const [nome, setNome] = useState("Super Admin");
  const [email, setEmail] = useState("admin@mukanda.com");
  const [telefone, setTelefone] = useState("912345678");

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  // Modais de confirmação
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  // Atualizar dados
  const handleAtualizarDados = () => {
    // Aqui você chamaria a API para atualizar
    setModalSucesso(true);
  };

  // Atualizar senha
  const handleAtualizarSenha = () => {
    if (novaSenha !== confirmaSenha) {
      setMensagemErro("A nova senha e a confirmação não coincidem!");
      setModalErro(true);
      return;
    }
    // Aqui você chamaria a API para atualizar a senha
    setModalSucesso(true);
    // Limpa campos de senha
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmaSenha("");
  };

  return (
    <>
      <title>Configurações | Mukanda Cloud</title>
      <StaffLayout title="Configurações">
        <div className="max-w-2xl mx-auto p-4 flex flex-col gap-8">

          {/* Atualizar Dados */}
          <div className="bg-slate-900 p-6 rounded-xl border border-blue-900">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Atualizar Dados</h2>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
            />
            <button
              onClick={handleAtualizarDados}
              className="w-full py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg cursor-pointer"
            >
              Atualizar Dados
            </button>
          </div>

          {/* Atualizar Senha */}
          <div className="bg-slate-900 p-6 rounded-xl border border-blue-900">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Atualizar Senha</h2>
            <input
              type="password"
              placeholder="Senha Atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
            />
            <input
              type="password"
              placeholder="Nova Senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
            />
            <input
              type="password"
              placeholder="Confirmar Nova Senha"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
            />
            <button
              onClick={handleAtualizarSenha}
              className="w-full py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg cursor-pointer"
            >
              Atualizar Senha
            </button>
          </div>

        </div>

        {/* Modal Sucesso */}
        <ModalSmall
          isOpen={modalSucesso}
          onClose={() => setModalSucesso(false)}
          title="Sucesso"
          icon="fas fa-check"
        >
          <p className="text-slate-200">Atualização realizada com sucesso!</p>
        </ModalSmall>

        {/* Modal Erro */}
        <ModalSmall
          isOpen={modalErro}
          onClose={() => setModalErro(false)}
          title="Erro"
          icon="fas fa-exclamation-triangle"
        >
          <p className="text-red-400">{mensagemErro}</p>
        </ModalSmall>

      </StaffLayout>
    </>
  );
}