# Real Estate (Next.js + Prisma)

Application immobilière (UX “premium”) avec:

- Next.js (App Router)
- Prisma + MongoDB
- Auth backoffice (NextAuth Credentials)
- Google Maps (loader centralisé)

## Démarrage

```bash
npm install
npm run dev
```

## Configuration (.env)

Créer un fichier `.env` à la racine (voir `.env.example`).

### Base de données

- `DATABASE_URL` : URL MongoDB pour Prisma.

### Auth (backoffice)

- `NEXTAUTH_URL` : ex `http://localhost:3000`
- `NEXTAUTH_SECRET` : une chaîne aléatoire (32+ caractères)
- `ADMIN_EMAILS` : liste d'emails admin séparés par virgule (obligatoire)
- `STAFF_EMAILS` : liste d'emails staff séparés par virgule (optionnel)

Règles:

- Si `STAFF_EMAILS` est défini, seuls `STAFF_EMAILS` + `ADMIN_EMAILS` peuvent se connecter.
- Si `STAFF_EMAILS` n'est pas défini, seuls `ADMIN_EMAILS` peuvent se connecter.

Bootstrap (premier compte):

- Tant qu'il n'y a aucun user en base, `/register` permet uniquement de créer le premier compte ADMIN (email présent dans `ADMIN_EMAILS`).
- Ensuite, seule une session ADMIN peut créer des comptes (via `/register`).

### Google Maps

- `NEXT_PUBLIC_MAPS_API_KEY`

## Prisma

```bash
npm run db:push
npm run db:seed
```

## Workflow annonces (statut)

Les annonces ont un champ `status` : `DRAFT`, `PUBLISHED`, `SOLD`, `RENTED`, `ARCHIVED`.

- Le **site public** n'affiche que les annonces `PUBLISHED`.
- Le **backoffice** permet de changer le statut (publier/dépublier, marquer vendu/loué, archiver).

Si tu avais déjà des biens en base avant l'ajout du champ, lance:

```bash
npm run db:backfill:status
```

## Build

```bash
npm run build
npm run start
```
