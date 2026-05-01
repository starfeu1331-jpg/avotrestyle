# TODO — Refonte avotrestyle.fr

## Contexte général

Site vitrine statique (HTML/CSS/JS) pour **Patrick Juillet — À Votre Style**, artisan rénovation/menuiserie à Valence (Drôme 26 / Ardèche 07).

- **Repo GitHub** : https://github.com/starfeu1331-jpg/avotrestyle
- **Déploiement** : Vercel (repo connecté, `vercel.json` configuré) — domaine `avotrestyle.fr` redirigé depuis Obambu
- **Téléphone** : 06 89 31 33 98
- **Email** : contact@avotrestyle.fr
- **Adresse** : 3 rue Véronique, 26120 Malissard
- **SIRET** : 902 185 131 00015
- **Google Analytics** : G-1D14PCKE79
- **Formulaire contact** : Google Apps Script → Google Sheets
  - URL script : `https://script.google.com/macros/s/AKfycbxsvO7ANTsAiDWptcM3rAuvD8i45jI4TRkjBjOptDwZW3V_BmIr6GBAVF7fvhY9VA95/exec`
- **Avis Google** : https://share.google/YoFsb4uyt6JTvtIuO

## Structure des fichiers

```
/
├── index.html           ← page d'accueil
├── about.html           ← présentation Patrick Juillet
├── contact.html         ← formulaire devis
├── galerie.html         ← galerie photos avec lightbox + filtres
├── cuisine-menuiserie.html
├── travaux.html
├── design-amenagement.html
├── mentions-legales.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/style.css        ← CSS principal (857 lignes, variables CSS, responsive)
├── js/main.js           ← JS principal (menu mobile, formulaire, lightbox, animations)
└── img/                 ← logo + sous-dossiers cuisine/, travaux/, menuiserie/, design/
```

## Palette & Identité

- **Couleur principale** : `#3194a1` (--primary)
- **Police** : System-UI / -apple-system (Inter supprimé, jamais chargé)
- **Expérience cohérente à utiliser** : "plus de 15 ans" partout

---

## TODO — Corrections (par priorité)

### 🔴 CRITIQUES (bugs visibles / cassés)

- [x] **Reconstruire `mentions-legales.html`** — structure HTML cassée (double `</body></html>`, scripts hors `<head>`, ancienne nav incompatible, scripts fantômes)
- [x] **Corriger `robots.txt`** — supprime `Disallow: /css/` `/js/` `/img/` qui empêchent Google de rendre le site
- [x] **Corriger formulaire contact** — option "Rénovation de rénovation" → "Travaux de rénovation"

### 🟠 SEO URGENT

- [x] **Remplacer `href="index.html"` par `href="/"`** dans toute la nav (19 occurrences, 7 fichiers)
- [x] **Ajouter `<link rel="canonical">`** sur toutes les pages (seulement sur index.html actuellement)
- [x] **Ajouter Open Graph** (`og:title`, `og:description`, `og:image`, `og:url`) sur toutes les pages
- [x] **Ajouter favicon** — aucune icône définie sur aucune page
- [x] **Ajouter Schema.org JSON-LD `LocalBusiness`** sur `index.html` (nom, adresse, téléphone, zone, horaires)
- [x] **Corriger incohérence années d'expérience** — "5 ans" sur index.html → "15 ans" (cohérent avec le reste)
  - ⚠️ NOTE : "20 ans" dans `about.html` est correct (réfère aux années avant la création d'AVS)

### 🟡 QUALITÉ / NETTOYAGE

- [x] **Supprimer fichiers obsolètes** : `index-old.html`, `css/style-old.css`, `js/main-old.js`
- [x] **Nettoyer `img/`** : supprimer fichiers `._*` (22 AppleDouble macOS), `.DS_Store`, `.HEIC`, `.MOV`, `.jfif`
- [x] **Renommer le logo** : `img/logo a votre style.png` → `img/logo-a-votre-style.png` (espace dans le nom = fragile)
- [x] **Supprimer la référence Inter du CSS** — `'Inter'` retiré des variables `--font-main` et `--font-heading` (inutile, jamais chargé)
- [x] **Déplacer styles inline vers classes CSS** — ~200 styles inline migrés vers ~60 classes utilitaires dans `style.css` (héro variants, grids, cards, flex, step-number, contact-row, filter-btn, text utilities…). 21 restants légitimes (backgrounds héro uniques + layouts contact spécifiques)
- [ ] **Convertir images `.jpg` restantes en `.webp`** pour les performances
- [ ] **Mettre à jour `sitemap.xml`** — toutes les `<lastmod>` sont figées au 2025-11-14
- [x] **Mettre à jour mentions légales hébergeur** — hébergeur mis à jour vers Vercel Inc.

### 🔵 AMÉLIORATIONS (optionnel)

- [ ] **Ajouter une vraie page de confirmation** après soumission formulaire (`/merci.html`)
- [ ] **Galerie** : les images n'ont pas de `alt` descriptifs (ex: `alt="Cuisine aménagée"` trop générique)
- [ ] **Favicon SVG/ICO dédié** — actuellement on pointe sur le logo PNG
- [x] **Créer `vercel.json`** — `cleanUrls`, `trailingSlash: false`, redirect `/index.html` → `/`, headers sécurité (X-Frame-Options, X-Content-Type-Options, XSS…), cache long terme sur img/css/js

---

## Notes techniques importantes

- Le formulaire envoie vers Google Apps Script (pas de backend). Fonctionne en production mais CORS peut causer des faux "erreurs" côté JS même quand l'envoi réussit — à surveiller.
- `img/travaux/Sols/Faience.MOV` et `img/travaux/Trvx_apres_1.MOV` : vidéos iPhone, 161+ Mo, exclues du repo git (`.gitignore`).
- Fichiers `.HEIC` et `.MOV` déjà dans `.gitignore` mais présents localement.
- Le logo `img/logo a votre style.png` est référencé dans tous les fichiers HTML — bien mettre à jour toutes les références si renommé.
