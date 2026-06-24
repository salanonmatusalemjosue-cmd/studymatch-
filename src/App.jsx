import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Professeurs from "./pages/Professeurs";
import ProfilProf from "./pages/ProfilProf";
import Connexion from "./pages/Connexion";
import MonProfil from "./pages/MonProfil";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/professeurs" replace />} />
        <Route path="/professeurs" element={<Professeurs />} />
        <Route path="/professeurs/:id" element={<ProfilProf />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/mon-profil" element={<MonProfil />} />
      </Routes>
    </HashRouter>
  );
}
