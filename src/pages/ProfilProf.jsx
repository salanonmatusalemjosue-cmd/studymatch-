import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const COULEURS_NIVEAUX = {
  "Collège":   { bg: "#EAF3DE", color: "#27500A" },
  "Lycée":     { bg: "#E6F1FB", color: "#0C447C" },
  "Prépa":     { bg: "#EEEDFE", color: "#3C3489" },
  "BTS / BUT": { bg: "#FAEEDA", color: "#633806" },
  "Licence":   { bg: "#FAECE7", color: "#712B13" },
  "Master":    { bg: "#042C53", color: "#B5D4F4" },
};

export default function ProfilProf() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProf() {
      const { data } = await supabase.from("professeurs").select("*").eq("id", id).single();
      setProf(data);
      setLoading(false);
    }
    fetchProf();
  }, [id]);

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#64748B" }}>Chargement...</div>;
  if (!prof) return <div style={{ padding: "60px", textAlign: "center" }}>Professeur introuvable.</div>;

  const initiales = `${prof.prenom?.[0] || ""}${prof.nom?.[0] || ""}`.toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: "#0C447C", padding: "0 24px", display: "flex", alignItems: "center", gap: "16px", height: "56px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#B5D4F4", cursor: "pointer", fontSize: "20px" }}>←</button>
        <span style={{ color: "#fff", fontSize: "16px", fontWeight: 500 }}>Profil du professeur</span>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>
        {/* En-tête profil */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ height: "180px", background: prof.photo_url ? `url(${prof.photo_url}) center/cover` : "#B5D4F4", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!prof.photo_url && <span style={{ fontSize: "56px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{initiales}</span>}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,44,83,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: "16px", left: "20px" }}>
              <div style={{ color: "#fff", fontSize: "22px", fontWeight: 600 }}>{prof.prenom} {prof.nom}</div>
              <div style={{ color: "#B5D4F4", fontSize: "14px" }}>{prof.titre}</div>
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            {/* Badges niveaux */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
              {(prof.niveaux || []).map(n => (
                <span key={n} style={{
                  fontSize: "12px", padding: "4px 12px", borderRadius: "12px", fontWeight: 500,
                  background: COULEURS_NIVEAUX[n]?.bg || "#E2E8F0",
                  color: COULEURS_NIVEAUX[n]?.color || "#333",
                }}>{n}</span>
              ))}
              {(prof.matieres || []).map(m => (
                <span key={m} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "12px", background: "#E6F1FB", color: "#0C447C", fontWeight: 500 }}>{m}</span>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#042C53" }}>{"★".repeat(Math.round(prof.note || 0))}</div>
                <div style={{ fontSize: "12px", color: "#64748B" }}>{prof.note?.toFixed(1)} / 5 ({prof.nb_avis} avis)</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#042C53" }}>{prof.experience || 0} ans</div>
                <div style={{ fontSize: "12px", color: "#64748B" }}>d'expérience</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#042C53" }}>{prof.tarif} €/h</div>
                <div style={{ fontSize: "12px", color: "#64748B" }}>tarif horaire</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 500, color: prof.disponible ? "#27500A" : "#712B13" }}>
                  {prof.disponible ? "✓ Disponible" : "Bientôt dispo"}
                </div>
                <div style={{ fontSize: "12px", color: "#64748B" }}>{prof.ville}{prof.visio ? " & visio" : ""}</div>
              </div>
            </div>

            <button style={{
              width: "100%", background: "#0C447C", color: "#fff",
              border: "none", borderRadius: "10px", padding: "14px",
              fontSize: "15px", fontWeight: 500, cursor: "pointer",
            }}>
              Réserver un cours
            </button>
            {prof.premier_cours_offert && (
              <p style={{ textAlign: "center", fontSize: "13px", color: "#D85A30", marginTop: "8px", fontWeight: 500 }}>
                🎁 Premier cours offert
              </p>
            )}
          </div>
        </div>

        {/* Biographie */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#042C53", marginBottom: "12px" }}>À propos</h2>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7 }}>{prof.bio}</p>
        </div>

        {/* Vidéo */}
        {prof.video_url && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#042C53", marginBottom: "12px" }}>Extrait de cours</h2>
            <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: "10px", overflow: "hidden" }}>
              <iframe
                src={prof.video_url}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allowFullScreen
                title="Extrait de cours"
              />
            </div>
          </div>
        )}

        {/* Parcours */}
        {prof.parcours && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#042C53", marginBottom: "12px" }}>Parcours</h2>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>{prof.parcours}</p>
          </div>
        )}
      </div>
    </div>
  );
}
