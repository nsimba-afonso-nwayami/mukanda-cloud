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
import PermissoesSuperAdmin from "../pages/superadmin/PermissoesSuperAdmin";
import AtividadesSuperAdmin from "../pages/superadmin/AtividadesSuperAdmin";
import ConfigSuperAdmin from "../pages/superadmin/ConfigSuperAdmin";
import NotFoundSuperAdmin from "../pages/superadmin/NotFoundSuperAdmin";

//Dashboard Gerente
import DashboardGerente from "../pages/gerente/DashboardGerente";
import ArquivosGerente from "../pages/gerente/ArquivosGerente";
import EquipaGerente from "../pages/gerente/EquipaGerente";
import PermissoesGerente from "../pages/gerente/PermissoesGerente";
import AtividadesGerente from "../pages/gerente/AtividadesGerente";
import ConfigGerente from "../pages/gerente/ConfigGerente";
import NotFoundGerente from "../pages/gerente/NotFoundGerente";

//Dashboard Staff
import DashboardStaff from "../pages/staff/DashboardStaff";
import ArquivosStaff from "../pages/staff/ArquivosStaff";
import AtividadesStaff from "../pages/staff/AtividadesStaff";
import ConfigStaff from "../pages/staff/ConfigStaff";
import NotFoundStaff from "../pages/staff/NotFoundStaff";

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
        <Route path="permissoes" element={<PermissoesSuperAdmin />} />
        <Route path="atividades" element={<AtividadesSuperAdmin />} />
        <Route path="configuracoes" element={<ConfigSuperAdmin />} />
        <Route path="*" element={<NotFoundSuperAdmin />} />
      </Route>

      {/*Rotas do gerente */}
      <Route path="/dashboard/gerente/">
        <Route path="" element={<DashboardGerente />} />
        <Route path="arquivos" element={<ArquivosGerente />} />
        <Route path="equipa" element={<EquipaGerente />} />
        <Route path="permissoes" element={<PermissoesGerente />} />
        <Route path="atividades" element={<AtividadesGerente />} />
        <Route path="configuracoes" element={<ConfigGerente />} />
        <Route path="*" element={<NotFoundGerente />} />
      </Route>

      {/*Rotas do staff */}
      <Route path="/dashboard/staff/">
        <Route path="" element={<DashboardStaff />} />
        <Route path="arquivos" element={<ArquivosStaff />} />
        <Route path="atividades" element={<AtividadesStaff />} />
        <Route path="configuracoes" element={<ConfigStaff />} />
        <Route path="*" element={<NotFoundStaff />} />
      </Route>

    </Routes>
  );
}
