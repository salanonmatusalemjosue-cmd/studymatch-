export default function Filtres({ matieres, niveaux, matiere, niveau, recherche, onMatiere, onNiveau, onRecherche }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
      {/* Matières */}
      <div style={{ display: "flex", gap: "8px", padding: "14px 24px 10px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "#94A3B8", marginRight: "4px" }}>Matière :</span>
        {matieres.map(m => (
          <button
            key={m}
            onClick={() => onMatiere(m)}
            style={{
              border: `1px solid ${matiere === m ? "#0C447C" : "#CBD5E1"}`,
              borderRadius: "20px", padding: "5px 14px",
              fontSize: "12px",
              background: matiere === m ? "#0C447C" : "transparent",
              color: matiere === m ? "#fff" : "#475569",
              cursor: "pointer",
            }}
          >{m}</button>
        ))}
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={recherche}
          onChange={e => onRecherche(e.target.value)}
          style={{
            marginLeft: "auto", border: "1px solid #CBD5E1",
            borderRadius: "8px", padding: "5px 12px",
            fontSize: "13px", color: "#475569", outline: "none",
            width: "180px",
          }}
        />
      </div>
      {/* Niveaux */}
      <div style={{ display: "flex", gap: "6px", padding: "0 24px 14px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "#94A3B8", marginRight: "4px" }}>Niveau :</span>
        {niveaux.map(n => (
          <button
            key={n}
            onClick={() => onNiveau(n)}
            style={{
              border: `1px solid ${niveau === n ? "#185FA5" : "#CBD5E1"}`,
              borderRadius: "20px", padding: "4px 12px",
              fontSize: "12px",
              background: niveau === n ? "#185FA5" : "transparent",
              color: niveau === n ? "#fff" : "#475569",
              cursor: "pointer",
            }}
          >{n}</button>
        ))}
      </div>
    </div>
  );
}
