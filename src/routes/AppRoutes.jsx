import { Routes, Route } from "react-router-dom";

// Layout do site
import SiteLayout from "../layouts/SiteLayout";

// Private
//import PrivateRoute from "../routes/PrivateRoute";

//Site
import Home from "../pages/site/Home";
import Termos from "../pages/site/Termos";
import PoliticaPrivacidade from "../pages/site/PoliticaPrivacidade";
import NotFound from "../pages/site/NotFound";

//Autenticação
import Login from "../pages/auth/Login";
import Cadastrar from "../pages/auth/Cadastrar";
import RecuperarSenha from "../pages/auth/RecuperarSenha";
import ResetSenha from "../pages/auth/ResetSenha";

//Dashboard Super Admin
import DashboardSuperAdmin from "../pages/superadmin/DashboardSuperAdmin";
import ArquivosSuperAdmin from "../pages/superadmin/ArquivosSuperAdmin";
import DepartamentosSuperAdmin from "../pages/superadmin/DepartamentosSuperAdmin";
import EquipaSuperAdmin from "../pages/superadmin/EquipaSuperAdmin";
import AtividadesSuperAdmin from "../pages/superadmin/AtividadesSuperAdmin";
import NotFoundSuperAdmin from "../pages/superadmin/NotFoundSuperAdmin";

export default function AppRoutes() {
  return (
    <Routes>
      {/*Rotas do site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/*Rotas de autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/criar-conta" element={<Cadastrar />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/reset-senha" element={<ResetSenha />} />

      {/*Rotas do suoer admin */}
      <Route path="/dashboard/superadmin/">
          <Route path="" element={<DashboardSuperAdmin />} />
          <Route path="arquivos" element={<ArquivosSuperAdmin />} />
          <Route path="departamentos" element={<DepartamentosSuperAdmin />} />
          <Route path="equipa" element={<EquipaSuperAdmin />} />
          <Route path="atividades" element={<AtividadesSuperAdmin />} />
          <Route path="*" element={<NotFoundSuperAdmin />} />
      </Route>

    </Routes>
  );
}
