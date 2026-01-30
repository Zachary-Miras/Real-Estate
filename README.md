# Real Estate — Plateforme immobilière (Next.js + Prisma)

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20ou%20local-47A248)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC)
![License](https://img.shields.io/badge/License-Non%20sp%C3%A9cifi%C3%A9e-lightgrey)

Site immobilier avec pages publiques (achat/location, carte, fiches biens) + un backoffice pour gérer les biens et les leads.

## Sommaire

- [Real Estate — Plateforme immobilière (Next.js + Prisma)](#real-estate--plateforme-immobilière-nextjs--prisma)
  - [Sommaire](#sommaire)
  - [Fonctionnalités](#fonctionnalités)
  - [Stack](#stack)
  - [Démarrage rapide](#démarrage-rapide)
  - [Variables d’environnement](#variables-denvironnement)
  - [Base de données (Prisma + MongoDB)](#base-de-données-prisma--mongodb)
    - [Workflow “statut” des biens](#workflow-statut-des-biens)
  - [Backoffice \& Auth](#backoffice--auth)
  - [Scripts](#scripts)
  - [Déploiement](#déploiement)

## Fonctionnalités

- Catalogue de biens + pages publiques (détail, recherche, carte)
- Backoffice: CRUD biens, gestion de statut (brouillon/publication/vendu/loué/archivé)
- Leads: collecte via formulaires + gestion de statut côté backoffice
- Intégrations: Google Maps (loader centralisé), EmailJS (contact)

## Stack

- Next.js 14 (App Router)
- Prisma + MongoDB
- NextAuth (Credentials) pour l’authentification backoffice
- TailwindCSS
- Google Maps JavaScript API

## Démarrage rapide

Prérequis:

- Node.js 18+ (recommandé: 20)
- Une base MongoDB (local ou Atlas)

```bash
npm install
cp .env.example .env
```

1. Configure la variable `DATABASE_URL` dans `.env`

2. Synchronise le schéma Prisma avec MongoDB:

```bash
npx prisma db push
```

3. (Optionnel) Seed de données:

```bash
npm run db:seed
```

4. Lance l’app:

```bash
npm run dev
```

App: http://localhost:3000

## Variables d’environnement

Les variables sont listées dans `.env.example`.

| Variable                          | Obligatoire | Description                                 |
| --------------------------------- | ----------: | ------------------------------------------- |
| `DATABASE_URL`                    |         Oui | Connexion MongoDB utilisée par Prisma       |
| `NEXT_PUBLIC_MAPS_API_KEY`        | Selon usage | Clé Google Maps (affichage carte)           |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Selon usage | EmailJS — Template                          |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`  | Selon usage | EmailJS — Service                           |
| `NEXT_PUBLIC_EMAILJS_USER_ID`     | Selon usage | EmailJS — Public Key / User ID              |
| `NEXTAUTH_URL`                    |         Oui | URL de l’app (ex: `http://localhost:3000`)  |
| `NEXTAUTH_SECRET`                 |         Oui | Secret NextAuth (long et aléatoire)         |
| `ADMIN_EMAILS`                    |         Oui | Liste d’emails admin (séparés par virgules) |
| `STAFF_EMAILS`                    |         Non | Liste d’emails staff (séparés par virgules) |

## Base de données (Prisma + MongoDB)

Ce projet utilise Prisma avec le provider MongoDB.

- Appliquer le schéma à la base:

```bash
npx prisma db push
```

- Générer le client Prisma (si nécessaire):

```bash
npx prisma generate
```

- Ouvrir Prisma Studio (optionnel):

```bash
npx prisma studio
```

### Workflow “statut” des biens

Le modèle `Property` a un champ `status`:

- `DRAFT`, `PUBLISHED`, `SOLD`, `RENTED`, `ARCHIVED`

Règles:

- Le site public n’affiche que les biens `PUBLISHED`
- Le backoffice permet de changer le statut

Si tu avais déjà des biens en base avant l’ajout du champ, lance:

```bash
npm run db:backfill:status
```

## Backoffice & Auth

L’auth backoffice est basée sur NextAuth (Credentials).

Accès:

- Si `STAFF_EMAILS` est défini: seuls `STAFF_EMAILS` + `ADMIN_EMAILS` peuvent se connecter
- Sinon: seuls `ADMIN_EMAILS`

Bootstrap (premier compte):

- Tant qu’il n’y a aucun user en base, `/register` permet uniquement de créer le premier compte ADMIN (email présent dans `ADMIN_EMAILS`)
- Ensuite, seule une session ADMIN peut créer des comptes (via `/register`)

Entrées utiles:

- Backoffice: `/backoffice`
- Connexion: `/login`
- Inscription (contrôlée): `/register`

## Scripts

| Commande                     | Description                               |
| ---------------------------- | ----------------------------------------- |
| `npm run dev`                | Lance le serveur de dev                   |
| `npm run build`              | Build de production                       |
| `npm run start`              | Démarre le build                          |
| `npm run lint`               | Lint Next.js                              |
| `npm run db:seed`            | Seed Prisma                               |
| `npm run db:seed:reset`      | Seed avec reset (utilise `RESET_DB=true`) |
| `npm run db:backfill:status` | Backfill du champ `status`                |

## Déploiement

Recommandé: Vercel + MongoDB Atlas.

- Configure les variables d’environnement (au minimum `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAILS`)
- Assure-toi que l’URL de prod est cohérente avec `NEXTAUTH_URL`
- Après déploiement, applique le schéma si nécessaire: `npx prisma db push`

---

Si tu veux, je peux aussi:

- ajouter des badges “scripts”, “last commit”, etc.
- préparer une section “Architecture” plus détaillée (routes API, services, composants)
- ajouter un ou deux screenshots (si tu me dis où les mettre, ex: `public/`)
