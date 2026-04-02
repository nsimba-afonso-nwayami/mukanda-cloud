import { useEffect, useState } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

// Importação dos Schemas e Services
import { profileUpdateSchema, passwordUpdateSchema } from "../../validations/userSchema";
import { updateUser } from "../../services/userService";

export default function ConfigSuperAdmin() {
  const [userId, setUserId] = useState(null);

  // Form de Perfil
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    setValue,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
  });

  // Form de Senha
  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors, isSubmitting: passSubmitting },
  } = useForm({
    resolver: yupResolver(passwordUpdateSchema),
  });

  /**
   * 1. CARREGAR DADOS DO LOCALSTORAGE
   */
  useEffect(() => {
    const userDataRaw = localStorage.getItem("user");
    
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        setUserId(userData.id);

        const nameParts = userData.name ? userData.name.split(" ") : ["", ""];
        
        setValue("first_name", nameParts[0]);
        setValue("last_name", nameParts.slice(1).join(" ") || "");
        setValue("email", userData.email);
      } catch (error) {
        console.error("Erro ao processar dados do localStorage", error);
      }
    }
  }, [setValue]);

  /**
   * 2. ATUALIZAR DADOS PESSOAIS
   */
  const onProfileSubmit = async (data) => {
    try {
      await updateUser(userId, data);
      
      // Atualiza o cache local para refletir a mudança no UI global
      const userData = JSON.parse(localStorage.getItem("user"));
      userData.name = `${data.first_name} ${data.last_name}`;
      userData.email = data.email;
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar alterações de perfil.");
    }
  };

  /**
   * 3. ATUALIZAR SENHA
   */
  const onPassSubmit = async (data) => {
    try {
      await updateUser(userId, {
        current_password: data.current_password,
        password: data.password,
      });
      
      toast.success("Senha alterada com sucesso!");
      resetPass();
    } catch (error) {
      toast.error("Erro: Verifique se a senha atual está correta.");
    }
  };

  const inputStyle = "w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg focus:border-cyan-500 focus:outline-none transition-all";
  const labelStyle = "block text-xs text-slate-400 mb-1 ml-1 uppercase font-bold tracking-tighter";

  return (
    <>
      <title>Configurações | Mukanda Cloud</title>
      <SuperAdminLayout title="Configurações">
        <div className="max-w-2xl mx-auto p-4 flex flex-col gap-8">

          {/* SEÇÃO: DADOS PESSOAIS */}
          <section className="bg-slate-900 p-6 rounded-xl border border-blue-900 shadow-lg">
            <h2 className="text-sm font-bold text-cyan-500 mb-6 uppercase tracking-widest">
              Informações da Conta
            </h2>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Primeiro Nome</label>
                  <input {...regProfile("first_name")} className={inputStyle} />
                  {profileErrors.first_name && <p className="text-red-500 text-xs mt-1">{profileErrors.first_name.message}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Apelido</label>
                  <input {...regProfile("last_name")} className={inputStyle} />
                  {profileErrors.last_name && <p className="text-red-500 text-xs mt-1">{profileErrors.last_name.message}</p>}
                </div>
              </div>
              <div>
                <label className={labelStyle}>Endereço de Email</label>
                <input {...regProfile("email")} className={inputStyle} />
                {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>}
              </div>
              <button 
                disabled={profileSubmitting || !userId} 
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                {profileSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          </section>

          {/* SEÇÃO: ALTERAR SENHA */}
          <section className="bg-slate-900 p-6 rounded-xl border border-blue-900 shadow-lg">
            <h2 className="text-sm font-bold text-cyan-500 mb-6 uppercase tracking-widest">
              Segurança
            </h2>
            <form onSubmit={handlePassSubmit(onPassSubmit)} className="space-y-4">
              <div>
                <label className={labelStyle}>Senha Atual</label>
                <input type="password" {...regPass("current_password")} className={inputStyle} />
                {passErrors.current_password && <p className="text-red-500 text-xs mt-1">{passErrors.current_password.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Nova Senha</label>
                  <input type="password" {...regPass("password")} className={inputStyle} />
                  {passErrors.password && <p className="text-red-500 text-xs mt-1">{passErrors.password.message}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Confirmar Nova Senha</label>
                  <input type="password" {...regPass("confirmaSenha")} className={inputStyle} />
                  {passErrors.confirmaSenha && <p className="text-red-500 text-xs mt-1">{passErrors.confirmaSenha.message}</p>}
                </div>
              </div>
              <button 
                disabled={passSubmitting || !userId} 
                className="w-full py-3 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-slate-900 font-bold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                {passSubmitting ? "Processando..." : "Atualizar Senha de Acesso"}
              </button>
            </form>
          </section>
        </div>
      </SuperAdminLayout>
    </>
  );
}