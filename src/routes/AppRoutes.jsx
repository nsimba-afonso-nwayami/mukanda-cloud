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

    </Routes>
  );
}
