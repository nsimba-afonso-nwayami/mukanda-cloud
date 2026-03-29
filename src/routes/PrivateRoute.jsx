import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  // 1. Enquanto carrega do localStorage, não redireciona
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-bold">
        MUKANDA CLOUD...
      </div>
    );
  }

  // 2. Se não houver usuário após o loading, login neles
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Validação de cargo (Role)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.error("Acesso negado: Role insuficiente", user?.role);
    // Redireciona para o login ou uma página de "Sem Permissão"
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}