import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { loginSchema } from "../../validations/loginSchema";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

   const onSubmit = async (data) => {
    const toastId = toast.loading("Entrando...");

    const result = await login({
      email: data.email,
      password: data.senha,
    });

    if (result.success) {
      toast.success("Login realizado com sucesso!", { id: toastId });

      const role = result.user.role;

      if (role === "super_admin") {
        navigate("/dashboard/superadmin");
      } else if (role === "dept_manager") {
        navigate("/dashboard/gerente");
      } else {
        navigate("/dashboard/staff");
      }
    } else {
      toast.error(result.error, { id: toastId });
    }
  };

  return (
    <>
      <title>Login | Mukanda Cloud</title>

      <section className="relative bg-slate-950 min-h-screen flex items-center justify-center px-6 overflow-hidden">
        
        <div className="absolute top-0 right-0 w-100 h-100 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-lg p-8 shadow-2xl">
            
            <div className="flex flex-col items-center mb-8 gap-4">
              <div className="w-12 h-12 bg-slate-950 border border-blue-900/30 rounded-md flex items-center justify-center">
                <i className="fas fa-cloud text-cyan-500 text-lg"></i>
              </div>
              <h1 className="text-white font-black tracking-[0.2em] uppercase text-sm">
                Mukanda Cloud
              </h1>
            </div>

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

              {/* EMAIL */}
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                <input
                  type="email"
                  placeholder="E-mail"
                  {...register("email")}
                  className={`w-full pl-11 pr-4 py-3 text-sm rounded-md bg-slate-950/60 text-white border ${
                    errors.email ? "border-red-500" : "border-blue-900/30"
                  } focus:border-cyan-500 outline-none transition-all`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* SENHA */}
              <div className="space-y-2">
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                  <input
                    type="password"
                    placeholder="Senha"
                    {...register("senha")}
                    className={`w-full pl-11 pr-4 py-3 text-sm rounded-md bg-slate-950/60 text-white border ${
                      errors.senha ? "border-red-500" : "border-blue-900/30"
                    } focus:border-cyan-500 outline-none transition-all`}
                  />
                </div>

                {errors.senha && (
                  <p className="text-red-500 text-xs">{errors.senha.message}</p>
                )}

                <div className="flex justify-end">
                  <Link to="/recuperar-senha" className="text-[10px] text-slate-500 hover:text-cyan-500 uppercase font-bold tracking-widest">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                className="w-full cursor-pointer py-3.5 bg-cyan-500 text-slate-950 font-black rounded-md hover:bg-cyan-300 transition-all uppercase tracking-widest text-xs mt-2"
              >
                Entrar
              </button>

            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <Link to="/criar-conta" className="text-[10px] text-slate-400 hover:text-white uppercase font-bold tracking-[0.2em]">
                Criar Nova Conta
              </Link>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-slate-600 hover:text-slate-400 text-[9px] font-bold uppercase tracking-[0.4em]">
              <i className="fas fa-arrow-left mr-2"></i> Voltar
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}