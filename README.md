# StudyMatch — Guide d'installation

## Structure du projet

```
studymatch/
├── src/
│   ├── pages/
│   │   ├── Professeurs.jsx     → Page principale (liste des profs)
│   │   ├── ProfilProf.jsx      → Page détaillée d'un prof
│   │   ├── Connexion.jsx       → Connexion / inscription prof
│   │   └── MonProfil.jsx       → Dashboard prof (modifier son profil)
│   ├── components/
│   │   ├── CarteProf.jsx       → Carte visuelle d'un prof
│   │   └── Filtres.jsx         → Filtres matières + niveaux
│   ├── lib/
│   │   └── supabase.js         → Client Supabase
│   ├── App.jsx                 → Routing
│   ├── main.jsx                → Point d'entrée
│   └── index.css               → Styles globaux
├── index.html
├── vite.config.js
├── package.json
├── .env.example                → Variables d'environnement
└── supabase_setup.sql          → Script SQL à exécuter sur Supabase
```

---

## Étape 1 — Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un compte gratuit
2. Clique **New project**, donne-lui un nom (ex: "studymatch")
3. Choisis un mot de passe pour la BDD et une région (Europe West)
4. Attends 1-2 minutes que le projet se lance

---

## Étape 2 — Configurer la base de données

1. Dans Supabase, va dans **SQL Editor** (menu gauche)
2. Clique **New query**
3. Copie-colle tout le contenu de `supabase_setup.sql`
4. Clique **Run**

---

## Étape 3 — Créer le bucket de stockage photos

1. Dans Supabase, va dans **Storage** (menu gauche)
2. Clique **New bucket**
3. Nom : `professeurs`
4. Coche **Public bucket** (pour que les photos soient accessibles)
5. Clique **Save**

---

## Étape 4 — Récupérer les clés API

1. Dans Supabase, va dans **Settings > API**
2. Copie :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## Étape 5 — Configurer le projet local

```bash
# Copie le fichier d'environnement
cp .env.example .env

# Ouvre .env et remplace les valeurs
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

---

## Étape 6 — Lancer le projet

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Le site est sur http://localhost:5173
```

---

## Pages disponibles

| URL | Description |
|-----|-------------|
| `/professeurs` | Liste publique des professeurs avec filtres |
| `/professeurs/:id` | Profil détaillé d'un professeur |
| `/connexion` | Connexion / inscription pour les profs |
| `/mon-profil` | Dashboard prof — modifier photo, bio, matières, niveaux, tarif, vidéo |

---

## Déploiement sur Vercel (gratuit)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Puis dans le dashboard Vercel, ajoute les variables d'environnement :
# VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

---

## Fonctionnement de la sécurité (RLS)

- N'importe qui peut **lire** les profils (page publique)
- Un prof **connecté** ne peut modifier **que son propre profil** — cette règle est appliquée directement dans Supabase, impossible à contourner
- Les mots de passe sont gérés par Supabase Auth (hashés, sécurisés)
