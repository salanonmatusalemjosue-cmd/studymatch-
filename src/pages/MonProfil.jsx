import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const MATIERES_DISPO = ["Maths", "Physique", "Chimie", "Français", "Anglais", "Espagnol", "Histoire", "SVT", "Éco / Gestion", "Informatique", "Philosophie"];
const NIVEAUX_DISPO = ["Collège", "Lycée", "Prépa", "BTS / BUT", "Licence", "Master"];

export default function MonProfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [form, setForm] = useState({
    prenom: "", nom: "", titre: "", bio: "", bio_courte: "", parcours: "",
    ville: "", tarif: "", experience: "", video_url: "",
    matieres: [], niveaux: [], visio: true, disponible: true,
    premier_cours_offert: false, ambassadeur: false,
  });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/connexion"); return; }
      setUser(user);
      const { data } = await supabase.from("professeurs").select("*").eq("id", user.id).single();
      if (data) {
        setProfil(data);
        setForm({ ...form, ...data });
      }
      setLoading(false);
    }
    init();
  }, []);

  function toggleItem(liste, item) {
    return liste.includes(item) ? liste.filter(x => x !== item) : [...liste, item];
  }

  async function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploadPhoto(true);
    const ext = file.name.split(".").pop();
    const chemin = `photos/${user.id}.${ext}`;
    const { error: upErr } = await supabase.storage.from("professeurs").upload(chemin, file, { upsert: true });
    if (!upErr) {
      const { data } = supabase.storage.from("professeurs").getPublicUrl(chemin);
      setForm(f => ({ ...f, photo_url: data.publicUrl }));
    }
    setUploadPhoto(false);
  }

  async function handleSauvegarde(e) {
    e.preventDefault();
    setSauvegarde(true);
    await supabase.from("professeurs").upsert({ ...form, id: user.id, email: user.email });
    setTimeout(() => setSauvegarde(false), 2000);
  }

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    navigate("/connexion");
  }

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#64748B" }}>Chargement...</div>;

  const champ = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px" }}>{label}</label>
      <input
        type={type} value={form[key] || ""} placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ background: "#0C447C", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
        <Link to="/professeurs" style={{ color: "#fff", fontSize: "17px", fontWeight: 600, textDecoration: "none" }}>StudyMatch</Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to={`/professeurs/${user?.id}`} style={{ color: "#B5D4F4", fontSize: "13px", textDecoration: "none" }}>Voir mon profil public</Link>
          <button onClick={handleDeconnexion} style={{ background: "none", border: "1px solid #B5D4F4", color: "#B5D4F4", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", cursor: "pointer" }}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "28px 16px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#042C53", marginBottom: "6px" }}>Mon profil</h1>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "28px" }}>
          Ces informations seront visibles par les élèves et leurs familles.
        </p>

        <form onSubmit={handleSauvegarde}>

          {/* Photo de profil */}
          <section style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#042C53", marginBottom: "16px" }}>Photo de profil</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%", flexShrink: 0,
                background: form.photo_url ? `url(${form.photo_url}) center/cover` : "#B5D4F4",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", fontWeight: 600, color: "rgba(255,255,255,0.8)"
              }}>
                {!form.photo_url && `${form.prenom?.[0] || ""}${form.nom?.[0] || ""}`}
              </div>
              <div>
                <label style={{
                  background: "#0C447C", color: "#fff", borderRadius: "8px",
                  padding: "8px 16px", fontSize: "13px", fontWeight: 500,
                  cursor: "pointer", display: "inline-block",
                }}>
                  {uploadPhoto ? "Upload en cours..." : "Choisir une photo"}
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                </label>
                <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "6px" }}>JPG ou PNG, max 5 Mo</p>
              </div>
            </div>
          </section>

          {/* Informations personnelles */}
          <section style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#042C53", marginBottom: "16px" }}>Informations personnelles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              {champ("Prénom", "prenom", "text", "Marie")}
              {champ("Nom", "nom", "text", "Laurent")}
            </div>
            {champ("Titre / diplôme", "titre", "text", "Agrégée de mathématiques — ENS Lyon")}
            {champ("Ville", "ville", "text", "Paris")}
            {champ("Expérience (années)", "experience", "number", "5")}
            <div style={{ display: "flex", gap: "20px", marginBottom: "8px" }}>
              {[["visio", "Cours en visio"], ["disponible", "Disponible"], ["premier_cours_offert", "1er cours offert"]].map(([key, label]) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", cursor: "pointer" }}>
                  <input type="checkbox" checked={!!form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {/* Matières et niveaux */}
          <section style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#042C53", marginBottom: "16px" }}>Matières enseignées</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {MATIERES_DISPO.map(m => (
                <button type="button" key={m} onClick={() => setForm(f => ({ ...f, matieres: toggleItem(f.matieres, m) }))}
                  style={{
                    border: `1px solid ${form.matieres?.includes(m) ? "#0C447C" : "#CBD5E1"}`,
                    borderRadius: "20px", padding: "5px 14px", fontSize: "12px", cursor: "pointer",
                    background: form.matieres?.includes(m) ? "#E6F1FB" : "transparent",
                    color: form.matieres?.includes(m) ? "#0C447C" : "#475569",
                  }}>{m}</button>
              ))}
            </div>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#042C53", marginBottom: "12px" }}>Niveaux pris en charge</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {NIVEAUX_DISPO.map(n => (
                <button type="button" key={n} onClick={() => setForm(f => ({ ...f, niveaux: toggleItem(f.niveaux, n) }))}
                  style={{
                    border: `1px solid ${form.niveaux?.includes(n) ? "#185FA5" : "#CBD5E1"}`,
                    borderRadius: "20px", padding: "5px 14px", fontSize: "12px", cursor: "pointer",
                    background: form.niveaux?.includes(n) ? "#185FA5" : "transparent",
                    color: form.niveaux?.includes(n) ? "#fff" : "#475569",
                  }}>{n}</button>
              ))}
            </div>
          </section>

          {/* Bio */}
          <section style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#042C53", marginBottom: "16px" }}>Présentation</h2>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px" }}>Phrase d'accroche (affichée sur la carte)</label>
              <input value={form.bio_courte || ""} onChange={e => setForm(f => ({ ...f, bio_courte: e.target.value }))}
                maxLength={120} placeholder="Ex: Agrégée de maths, spécialiste prépa et lycée..."
                style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px" }}>Biographie complète</label>
              <textarea value={form.bio || ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={5} placeholder="Décrivez votre parcours, votre méthode pédagogique, vos spécialités..."
                style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "#475569", display: "block", marginBottom: "6px" }}>Parcours détaillé</label>
              <textarea value={form.parcours || ""} onChange={e => setForm(f => ({ ...f, parcours: e.target.value }))}
                rows={4} placeholder="Diplômes, expériences professionnelles, formations..."
                style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>
          </section>

          {/* Tarif et vidéo */}
          <section style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#042C53", marginBottom: "16px" }}>Tarif & vidéo</h2>
            {champ("Tarif horaire (€)", "tarif", "number", "35")}
            {champ("Lien vidéo extrait de cours (YouTube embed)", "video_url", "url", "https://www.youtube.com/embed/...")}
          </section>

          <button type="submit" style={{
            width: "100%", background: sauvegarde ? "#27500A" : "#0C447C",
            color: "#fff", border: "none", borderRadius: "10px",
            padding: "14px", fontSize: "15px", fontWeight: 500, cursor: "pointer",
            transition: "background 0.2s",
          }}>
            {sauvegarde ? "✓ Profil sauvegardé !" : "Sauvegarder mon profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
