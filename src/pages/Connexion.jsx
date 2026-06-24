import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Connexion() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("connexion"); // "connexion" | "inscription"
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState("");

  async function handleSoumission(e) {
    e.preventDefault();
    setErreur("");
    setLoading(true);

    if (mode === "inscription") {
      const { data, error } = await supabase.auth.signUp({ email, password: motDePasse });
      if (error) { setErreur(error.message); setLoading(false); return; }
      // Créer un profil vide dans la table professeurs
      if (data.user) {
        await supabase.from("professeurs").insert({ id: data.user.id, email, prenom: "", nom: "" });
      }
      setSucces("Compte créé ! Vérifiez votre email pour confirmer.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
      if (error) { setErreur("Email ou mot de passe incorrect."); setLoading(false); return; }
      navigate("/mon-profil");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "#0C447C", padding: "0 24px", display: "flex", alignItems: "center", height: "56px" }}>
        <a href="/professeurs" style={{ color: "#fff", fontSize: "18px", fontWeight: 600, textDecoration: "none" }}>StudyMatch</a>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "32px", width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#042C53", marginBottom: "6px" }}>
            {mode === "connexion" ? "Connexion professeur" : "Créer un compte"}
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
            {mode === "connexion" ? "Accédez à votre espace pour modifier votre profil." : "Rejoignez StudyMatch en tant que professeur."}
          </p>

          {succes ? (
            <div style={{ background: "#EAF3DE", color: "#27500A", padding: "14px", borderRadius: "10px", fontSize: "14px" }}>{succes}</div>
          ) : (
            <form onSubmit={handleSoumission} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px" }}>Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px" }}>Mot de passe</label>
                <input
                  type="password" required value={motDePasse} onChange={e => setMotDePasse(e.target.value)}
                  style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {erreur && <p style={{ fontSize: "13px", color: "#D85A30" }}>{erreur}</p>}

              <button type="submit" disabled={loading} style={{
                background: "#0C447C", color: "#fff", border: "none",
                borderRadius: "10px", padding: "12px", fontSize: "15px",
                fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Chargement..." : mode === "connexion" ? "Se connecter" : "Créer mon compte"}
              </button>
            </form>
          )}

          <p style={{ fontSize: "13px", color: "#64748B", marginTop: "20px", textAlign: "center" }}>
            {mode === "connexion" ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button onClick={() => { setMode(mode === "connexion" ? "inscription" : "connexion"); setErreur(""); }}
              style={{ background: "none", border: "none", color: "#0C447C", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>
              {mode === "connexion" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
