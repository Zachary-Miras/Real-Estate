# Real Estate — Plateforme immobilière

Plateforme immobilière moderne construite avec Next.js 14, Prisma et MongoDB. Elle combine un catalogue public complet et un backoffice pour la gestion des biens et des leads.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![Prisma](https://img.shields.io/badge/Prisma-5.19-2D3748)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933)

## Sommaire

- [Real Estate — Plateforme immobilière](#real-estate--plateforme-immobilière)
  - [Sommaire](#sommaire)
  - [Fonctionnalités](#fonctionnalités)
  - [Stack technique](#stack-technique)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Base de données](#base-de-données)
  - [Backoffice et authentification](#backoffice-et-authentification)
  - [API routes](#api-routes)
  - [Scripts](#scripts)
  - [Structure du projet](#structure-du-projet)
  - [Déploiement](#déploiement)

## Fonctionnalités

Interface publique:

- Catalogue de biens avec recherche et filtres
- Fiches détaillées des biens
- Carte interactive avec Google Maps
- Pages spécialisées (achat, location, estimation)
- Formulaires de contact avec EmailJS

Backoffice:

- CRUD complet des biens
- Gestion de statut (brouillon, publication, vendu, loué, archivé)
- Gestion des leads et suivi de statut
- Authentification via NextAuth

## Stack technique

| Technologie | Version     | Usage                        |
| ----------- | ----------- | ---------------------------- |
| Next.js     | 14.2        | Framework React (App Router) |
| Prisma      | 5.19        | ORM pour MongoDB             |
| MongoDB     | Atlas/Local | Base de données              |
| NextAuth    | 4.24        | Authentification backoffice  |
| TailwindCSS | 3.4         | Styling                      |
| Google Maps | API v3      | Cartes interactives          |
| EmailJS     | 4.4         | Envoi d'emails               |

## Installation

Prerequis:

- Node.js 20.x
- MongoDB (local ou Atlas)

```bash
npm install
cp .env.example .env.local
```

## Configuration

Configurer les variables d'environnement dans `.env.local`:

```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-long-et-aleatoire"
ADMIN_EMAILS="admin@example.com"
STAFF_EMAILS="staff@example.com"
NEXT_PUBLIC_MAPS_API_KEY="votre-cle-google-maps"
NEXT_PUBLIC_GOOGLE_MAP_ID="votre-map-id"
NEXT_PUBLIC_EMAILJS_SERVICE_ID="votre-service-id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="votre-template-id"
NEXT_PUBLIC_EMAILJS_USER_ID="votre-user-id"
```

| Variable                        | Obligatoire | Description                   |
| ------------------------------- | ----------: | ----------------------------- |
| DATABASE_URL                    |         Oui | Connexion MongoDB pour Prisma |
| NEXTAUTH_URL                    |         Oui | URL de l'app                  |
| NEXTAUTH_SECRET                 |         Oui | Secret NextAuth               |
| ADMIN_EMAILS                    |         Oui | Liste d'emails admin          |
| STAFF_EMAILS                    |         Non | Liste d'emails staff          |
| NEXT_PUBLIC_MAPS_API_KEY        | Selon usage | Google Maps API               |
| NEXT_PUBLIC_GOOGLE_MAP_ID       |         Non | Google Map ID                 |
| NEXT_PUBLIC_EMAILJS_SERVICE_ID  | Selon usage | EmailJS Service               |
| NEXT_PUBLIC_EMAILJS_TEMPLATE_ID | Selon usage | EmailJS Template              |
| NEXT_PUBLIC_EMAILJS_USER_ID     | Selon usage | EmailJS Public Key            |

## Base de données

```bash
npx prisma db push
npx prisma generate
```

Workflow des statuts:

- DRAFT, PUBLISHED, SOLD, RENTED, ARCHIVED
- Seuls les biens PUBLISHED sont visibles publiquement

Backfill pour les anciennes donnees:

```bash
npm run db:backfill:status
```

## Backoffice et authentification

- Acces: `/backoffice`
- Connexion: `/login`
- Inscription controlee: `/register`

Regles:

- Si `STAFF_EMAILS` est defini: seuls STAFF + ADMIN peuvent se connecter
- Sinon: seuls ADMIN

## API routes

| Endpoint                        | Methode        | Description               |
| ------------------------------- | -------------- | ------------------------- |
| /api/auth/[...nextauth]         | POST           | Authentification NextAuth |
| /api/register                   | POST           | Inscription utilisateur   |
| /api/diagnostics                | GET            | Diagnostic app            |
| /api/health                     | GET            | Health check              |
| /api/leads                      | GET/POST       | Leads publics             |
| /api/backoffice/leads           | GET/PUT        | Leads backoffice          |
| /api/backoffice/properties      | GET/POST       | Biens backoffice          |
| /api/backoffice/properties/[id] | GET/PUT/DELETE | Biens par id              |

## Scripts

| Commande                   | Description              |
| -------------------------- | ------------------------ |
| npm run dev                | Lance le serveur de dev  |
| npm run build              | Build de production      |
| npm run start              | Demarre le build         |
| npm run lint               | Lint Next.js             |
| npm run db:seed            | Seed Prisma              |
| npm run db:seed:reset      | Seed avec reset          |
| npm run db:backfill:status | Backfill du champ status |

## Structure du projet

```
shop/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── backfillPropertyStatus.js
├── src/
│   ├── app/
│   ├── Components/
│   └── services/
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.mjs
├── jsconfig.json
└── package.json
```

## Déploiement

```bash
npm run build
npm run start
```
