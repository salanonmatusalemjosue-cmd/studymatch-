import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import CarteProf from "../components/CarteProf";
import Filtres from "../components/Filtres";

const MATIERES = ["Toutes", "Maths", "Physique", "Français", "Anglais", "Éco / Gestion", "Informatique", "Histoire", "SVT"];
const NIVEAUX = ["Tous", "Collège", "Lycée", "Prépa", "BTS / BUT", "Licence", "Master"];

export default function Professeurs() {
  const [profs, setProfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matiere, setMatiere] = useState("Toutes");
  const [niveau, setNiveau] = useState("Tous");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    fetchProfs();
  }, []);

  async function fetchProfs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("professeurs")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setProfs(data || []);
    setLoading(false);
  }

  const profsFiltres = profs.filter((p) => {
    const matchMatiere = matiere === "Toutes" || (p.matieres || []).includes(matiere);
    const matchNiveau = niveau === "Tous" || (p.niveaux || []).includes(niveau);
    const matchRecherche =
      recherche === "" ||
      p.prenom?.toLowerCase().includes(recherche.toLowerCase()) ||
      p.nom?.toLowerCase().includes(recherche.toLowerCase()) ||
      p.bio?.toLowerCase().includes(recherche.toLowerCase());
    return matchMatiere && matchNiveau && matchRecherche;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: "#0C447C", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
        <span style={{ color: "#fff", fontSize: "18px", fontWeight: 600 }}>StudyMatch</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="/professeurs" style={{ color: "#fff", fontSize: "14px", textDecoration: "none" }}>Professeurs</a>
          <a href="#" style={{ color: "#B5D4F4", fontSize: "14px", textDecoration: "none" }}>Comment ça marche</a>
        </div>
        <a href="/connexion" style={{ background: "#fff", color: "#0C447C", border: "none", borderRadius: "8px", padding: "7px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer", textDecoration: "none" }}>
          Devenir prof
        </a>
      </nav>

      {/* Hero */}
      <div style={{ background: "#E6F1FB", padding: "32px 24px 24px", borderBottom: "1px solid #B5D4F4" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#042C53", marginBottom: "6px" }}>
          Trouvez votre professeur particulier
        </h1>
        <p style={{ fontSize: "15px", color: "#185FA5" }}>
          Du collège jusqu'au master — en ligne ou en présentiel
        </p>
      </div>

      {/* Filtres */}
      <Filtres
        matieres={MATIERES}
        niveaux={NIVEAUX}
        matiere={matiere}
        niveau={niveau}
        recherche={recherche}
        onMatiere={setMatiere}
        onNiveau={setNiveau}
        onRecherche={setRecherche}
      />

      {/* Liste */}
      <div style={{ padding: "20px 24px" }}>
        <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
          {profsFiltres.length} professeur{profsFiltres.length !== 1 ? "s" : ""} disponible{profsFiltres.length !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748B" }}>Chargement...</div>
        ) : profsFiltres.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748B" }}>
            Aucun professeur ne correspond à vos critères.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {profsFiltres.map((prof) => (
              <CarteProf key={prof.id} prof={prof} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
