import { useState } from "react";
import { useNavigate } from "react-router-dom";

const COULEURS_NIVEAUX = {
  "Collège":   { bg: "#EAF3DE", color: "#27500A" },
  "Lycée":     { bg: "#E6F1FB", color: "#0C447C" },
  "Prépa":     { bg: "#EEEDFE", color: "#3C3489" },
  "BTS / BUT": { bg: "#FAEEDA", color: "#633806" },
  "Licence":   { bg: "#FAECE7", color: "#712B13" },
  "Master":    { bg: "#042C53", color: "#B5D4F4" },
};

export default function CarteProf({ prof }) {
  const [favori, setFavori] = useState(false);
  const navigate = useNavigate();

  const initiales = `${prof.prenom?.[0] || ""}${prof.nom?.[0] || ""}`.toUpperCase();
  const couleursFond = ["#d4b5a0", "#a8b8c8", "#b8c4a8", "#c4a8b8", "#b8b8c8", "#c8c4a8"];
  const couleurFond = couleursFond[(prof.prenom?.charCodeAt(0) || 0) % couleursFond.length];

  const etoiles = Math.round(prof.note || 0);

  return (
    <div
      onClick={() => navigate(`/professeurs/${prof.id}`)}
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        background: "#fff",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#94A3B8"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
    >
      {/* Photo */}
      <div style={{ position: "relative", paddingTop: "110%", background: couleurFond }}>
        {prof.photo_url ? (
          <img
            src={prof.photo_url}
            alt={`${prof.prenom} ${prof.nom}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "42px", fontWeight: 600, color: "rgba(255,255,255,0.8)"
          }}>
            {initiales}
          </div>
        )}

        {/* Badges niveaux */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {(prof.niveaux || []).slice(0, 3).map(n => (
            <span key={n} style={{
              fontSize: "10px", padding: "2px 8px", borderRadius: "10px",
              fontWeight: 500, lineHeight: 1.5,
              background: COULEURS_NIVEAUX[n]?.bg || "#E2E8F0",
              color: COULEURS_NIVEAUX[n]?.color || "#333",
            }}>{n}</span>
          ))}
          {(prof.niveaux || []).length > 3 && (
            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.85)", color: "#042C53", fontWeight: 500 }}>
              +{prof.niveaux.length - 3}
            </span>
          )}
        </div>

        {/* Bouton favori */}
        <button
          onClick={e => { e.stopPropagation(); setFavori(!favori); }}
          style={{
            position: "absolute", top: "10px", right: "10px",
            width: "30px", height: "30px", borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <span style={{ fontSize: "14px", color: favori ? "#E24B4A" : "#fff" }}>
            {favori ? "♥" : "♡"}
          </span>
        </button>

        {/* Overlay nom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(4,44,83,0.85) 0%, transparent 100%)",
          padding: "36px 12px 10px",
        }}>
          <div style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>
            {prof.prenom} {prof.nom?.[0]}.
          </div>
          <div style={{ color: "#B5D4F4", fontSize: "12px", marginTop: "2px" }}>
            📍 {prof.ville || "En ligne"}{prof.visio ? " & visio" : ""}
          </div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ padding: "12px" }}>
        {/* Note + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
          <span style={{ color: "#BA7517", fontSize: "14px" }}>{"★".repeat(etoiles)}{"☆".repeat(5 - etoiles)}</span>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#1E293B" }}>{prof.note?.toFixed(1)}</span>
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>({prof.nb_avis || 0} avis)</span>
          {prof.ambassadeur && (
            <span style={{
              marginLeft: "auto", background: "#EEEDFE", color: "#3C3489",
              fontSize: "11px", padding: "2px 7px", borderRadius: "10px",
            }}>✦ Ambassadeur</span>
          )}
        </div>

        {/* Bio courte */}
        <p style={{
          fontSize: "12px", color: "#475569", lineHeight: 1.55,
          marginBottom: "10px",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {prof.bio_courte || prof.bio}
        </p>

        {/* Prix + bouton */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#042C53" }}>
              {prof.tarif} €
            </span>
            <span style={{ fontSize: "12px", color: "#94A3B8" }}>/h</span>
            {prof.premier_cours_offert && (
              <div style={{ fontSize: "11px", color: "#D85A30", fontWeight: 500 }}>1er cours offert</div>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/professeurs/${prof.id}`); }}
            style={{
              background: "#0C447C", color: "#fff",
              border: "none", borderRadius: "8px",
              padding: "7px 14px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
            }}
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}
