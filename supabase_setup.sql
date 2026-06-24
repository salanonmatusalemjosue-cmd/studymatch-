-- ============================================================
-- StudyMatch — Script SQL à exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. TABLE PROFESSEURS
create table if not exists public.professeurs (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  prenom text default '',
  nom text default '',
  titre text default '',
  bio text default '',
  bio_courte text default '',
  parcours text default '',
  ville text default '',
  photo_url text,
  video_url text,
  tarif numeric(6,2) default 0,
  experience integer default 0,
  note numeric(3,2) default 5.0,
  nb_avis integer default 0,
  matieres text[] default '{}',
  niveaux text[] default '{}',
  visio boolean default true,
  disponible boolean default true,
  premier_cours_offert boolean default false,
  ambassadeur boolean default false,
  created_at timestamptz default now()
);

-- 2. ACTIVER RLS (Row Level Security)
-- Chaque prof ne peut modifier QUE son propre profil
alter table public.professeurs enable row level security;

-- Lecture publique : tout le monde peut voir les profils
create policy "Lecture publique des profils"
  on public.professeurs for select
  using (true);

-- Écriture : uniquement le prof lui-même
create policy "Un prof modifie uniquement son profil"
  on public.professeurs for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. BUCKET STOCKAGE PHOTOS
-- À créer manuellement dans Supabase Dashboard > Storage > New bucket
-- Nom : "professeurs" | Public : oui

-- 4. DONNÉES DE TEST (optionnel)
insert into public.professeurs (id, email, prenom, nom, titre, bio, bio_courte, ville, tarif, experience, note, nb_avis, matieres, niveaux, visio, disponible, premier_cours_offert, ambassadeur)
values
  (
    gen_random_uuid(),
    'marie.l@test.com',
    'Marie', 'Laurent',
    'Agrégée de mathématiques — ENS Lyon',
    'Ancienne élève de l''ENS Lyon, j''accompagne les lycéens et étudiants depuis 6 ans. Spécialiste des méthodes de raisonnement et de la préparation aux concours.',
    'Agrégée de maths — ENS Lyon. Spécialiste prépa et concours.',
    'Paris',
    45, 6, 5.0, 48,
    ARRAY['Maths', 'Physique'],
    ARRAY['Lycée', 'Prépa', 'Licence'],
    true, true, true, true
  ),
  (
    gen_random_uuid(),
    'thomas.c@test.com',
    'Thomas', 'Chevalier',
    'Doctorant en Physique — Université Paris-Saclay',
    'Doctorant en physique théorique, je propose des cours adaptés à chaque élève. Mon objectif : rendre les sciences accessibles et passionnantes.',
    'Doctorant physique théorique. Du collège jusqu''au master.',
    'Gif-sur-Yvette',
    32, 3, 4.9, 31,
    ARRAY['Physique', 'Maths', 'Chimie'],
    ARRAY['Collège', 'Lycée', 'Prépa', 'Master'],
    true, true, true, true
  ),
  (
    gen_random_uuid(),
    'sophie.b@test.com',
    'Sophie', 'Benali',
    'Professeure certifiée — Lettres modernes',
    'Certifiée en lettres modernes avec 10 ans d''expérience. Aide à la rédaction, analyse de textes, préparation au bac de français.',
    'Certifiée lettres modernes. Bac français, BTS, licence pro.',
    'Lyon',
    38, 10, 5.0, 62,
    ARRAY['Français', 'Histoire', 'Philosophie'],
    ARRAY['Collège', 'Lycée', 'BTS / BUT', 'Licence'],
    true, false, false, true
  );
