# Backend — Projet Ticket

API backend (helpdesk/tickets) construite avec NestJS + Prisma (MySQL/MariaDB).

## Prérequis

- Node.js (LTS) + npm
- Base MySQL/MariaDB accessible
- Variable d'environnement `DATABASE_URL` (connexion Prisma)

## Configuration

Variables d'environnement :

- `DATABASE_URL` : connexion Prisma (MySQL/MariaDB)
- `JWT_SECRET` : secret de signature JWT
- `JWT_EXPIRES_IN` (optionnel) : durée du token d'accès (défaut `8h`)
- `PORT` (optionnel) : port HTTP (défaut `3000`)

## Installation

```bash
npm install
```

## Lancer

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## CORS (front sur un autre port)

En développement, si le front est sur `http://localhost:5173` (Vite) et l'API sur `http://localhost:3000`, il faut autoriser l'origin côté backend.

Exemple (JWT Bearer, sans cookies) :

```ts
app.enableCors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Socle CRUD (API)

### Authentification

Le backend utilise des tokens JWT envoyés dans le header HTTP :

`Authorization: Bearer <token>`

Endpoints :

- `POST /auth/login`
  - si le mot de passe a déjà été changé : renvoie `{ "access_token": "..." }`
  - si c'est le premier login : renvoie `{ "must_change_password": true, "reset_token": "..." }`
- `POST /auth/change-password` (protégé par reset token)
  - header: `Authorization: Bearer <reset_token>`
  - body: `{ "newPassword": "..." }`
  - renvoie `{ "access_token": "..." }`
- `GET /auth/me` (protégé par access token)

### Identité & anti-spoofing

Pour les routes métier (tickets/messages/pièces jointes), l'identité de l'utilisateur vient du JWT.

- `tickets.id_createur` est imposé par le token (un client ne peut pas créer pour quelqu'un d'autre)
- `messages.id_utilisateur` est imposé par le token
- `piece-jointes.id_utilisateur` est imposé par le token

### Routes disponibles

- Équipes
  - `POST /equipes`
  - `GET /equipes`
  - `GET /equipes/:id`
  - `PATCH /equipes/:id`
  - `DELETE /equipes/:id`

- Utilisateurs
  - `POST /utilisateurs`
  - `GET /utilisateurs`
  - `GET /utilisateurs/:id`
  - `PATCH /utilisateurs/:id`
  - `DELETE /utilisateurs/:id`

- Catégories
  - `POST /categories`
  - `GET /categories`
  - `GET /categories/:id`
  - `PATCH /categories/:id`
  - `DELETE /categories/:id`

- Rôles
  - `POST /roles`
  - `GET /roles`
  - `GET /roles/:id`
  - `PATCH /roles/:id`
  - `DELETE /roles/:id`

- Tickets
  - `POST /tickets`
  - `GET /tickets`
  - `GET /tickets/:id`
  - `PATCH /tickets/:id`
  - `DELETE /tickets/:id`

- Messages (immutables)
  - `POST /messages`
  - `GET /messages`
  - `GET /messages/:id`
  - `DELETE /messages/:id`
  - Pas de `PATCH` (messages considérés immuables)

- Pièces jointes (immutables)
  - `POST /piece-jointes`
  - `GET /piece-jointes`
  - `GET /piece-jointes/:id`
  - `DELETE /piece-jointes/:id`
  - Pas de `PATCH`

- Historique actions (append-only)
  - `POST /historique-actions`
  - `GET /historique-actions`
  - `GET /historique-actions/:id`
  - Pas de `PATCH` / `DELETE`

- Rôles d'un utilisateur (endpoints métier)
  - `GET /utilisateurs/:id_utilisateur/roles`
  - `POST /utilisateurs/:id_utilisateur/roles` avec body `{ "id_role": "..." }`
  - `DELETE /utilisateurs/:id_utilisateur/roles/:id_role`

### Auth / RBAC (résumé)

Les routes sont protégées par JWT, et certaines par rôle :

- Équipes / Catégories
  - `GET` : JWT requis
  - `POST/PATCH/DELETE` : `admin` ou `manager`
- Rôles : `admin` uniquement
- Utilisateurs
  - `POST/GET(list)/DELETE` : `admin` uniquement
  - `GET/PATCH /utilisateurs/:id` : `self` (moi-même) ou `admin`
- Rôles d'un utilisateur : `admin` uniquement
- Historique
  - `GET` : `admin` / `manager` / `agent`
  - `POST` : `admin` uniquement

### Règles/validations importantes

- `tickets.etat` est validé côté DTO (liste autorisée), car les `CHECK` SQL ne sont pas gérés par Prisma.
- `messages.visibilite` est validé côté DTO (`public` | `interne`).
- Sur `PATCH /tickets/:id`, `id_agent_assigne: null` désassigne l'agent (disconnect).

## Règles métier & autorisations (v1)

### Rôles (pyramide)

Les rôles sont hiérarchiques : `Admin` ⟶ `Manager` ⟶ `Agent` ⟶ `User`.
Un rôle hérite des droits des rôles en-dessous.

IDs de rôles attendus (canoniques) :

- `admin`
- `manager`
- `agent`
- `user`

### Périmètres (scope) d'accès aux tickets

- **Admin** : accès à tous les tickets.
- **Manager** : accès à tous les tickets de son équipe.
- **Agent** : accès aux tickets (de son équipe) non assignés + aux tickets qui lui sont assignés.
- **User** : accès uniquement à ses propres tickets (créateur).

### Affectation d'un ticket à une équipe

L'équipe d'un ticket est déduite via la catégorie : `ticket.id_categorie -> categories.id_equipe`.
Le scope « tickets de l'équipe » se calcule donc via l'équipe de la catégorie.

### Tickets (cycle de vie et modifications)

- **Création** : `User+`.
- **Modification par User** : aucune (hors fermeture). Les informations complémentaires passent par des messages.
- **Fermeture sans résolution** : l'état `ferme` est utilisé (pas d'état `annule`).
- **Fermeture par User (etat=ferme)** : autorisée uniquement si `etat` ∈ {`nouveau`, `en_attente`, `en_cours`}.
- **Suppression** : action `Admin` uniquement.

Actions (rôle minimum) :

- **Changement d'état / résultat** : `Agent+`.
- **Assignation / désassignation** : `Manager+`.
- **Claim (auto-assignation)** : `Agent` si ticket non assigné et dans son équipe.

### Messages (communication et visibilité)

- Les messages sont **immutables** (pas de modification).
- `visibilite=public` : visible à toute personne ayant accès au ticket.
- `visibilite=interne` : réservé au staff (`Agent+`) ; non visible par `User`.

### Actions métier à privilégier (plutôt que PATCH permissif)

Pour éviter des `PATCH` trop ouverts et faciliter l'audit, ces actions métier sont recommandées :

- **Assignation par Manager/Admin** : assigner un ticket à un agent.
- **Claim par Agent** : un agent peut prendre un ticket non assigné (dans son équipe).
- **Fermeture** : fermeture d'un ticket avec justification (voir ci-dessous).

Règle de concurrence (claim) :

- En cas de claim simultané, **premier arrivé = assigné**, le second reçoit une erreur.

### Justification de fermeture (etat=ferme)

En v1, la fermeture exige une justification **à la fois** :

- un **message** de justification (généralement public)
- une **entrée d'historique** structurée

### Historique (audit)

- Mode **mixte** :
  - écriture **automatique par le backend** lors des actions métier (assignation, changement d'état, fermeture, etc.)
  - un `POST /historique-actions` peut rester disponible pour des cas exceptionnels, mais doit être **strictement restreint** (v1 : `Admin` uniquement).

Note : en v1, l'écriture automatique de l'historique dépend des services métier (tickets/messages). Si elle n'est pas encore branchée, `POST /historique-actions` reste disponible pour tests administrateur.

### Suppression de messages / pièces jointes

- Suppression autorisée : `Admin` uniquement.
- Les messages restent immuables (pas de modification).

### Suppression (soft delete + purge)

- Par défaut, une suppression est un **soft delete** (archivage) : l'enregistrement reste en base.
- Une **purge** (hard delete) peut exister en action séparée, réservée à `Admin`.
- En v1, la purge hard est autorisée **uniquement après expiration de la rétention**.
- La rétention est **fixe** (durée unique) et démarre à la **date de création** du ticket.

Paramètre à définir (politique interne / obligations) :

- Durée de rétention : **N** (jours/mois/années) pour tickets/messages/pièces jointes/historique.

## Checklist test manuel (Windows PowerShell)

Hypothèses : API sur `http://localhost:3000` et la DB est configurée via `DATABASE_URL`.

Note Windows : dans **Windows PowerShell**, la commande `curl` est souvent un **alias** de `Invoke-WebRequest`, ce qui casse les exemples type Linux/macOS.

- Option A (recommandée) : `Invoke-RestMethod` (simple, JSON natif)
- Option B : utiliser explicitement `curl.exe` (le binaire), pas `curl`

1) Démarrer l'API

```bash
npm run start:dev
```

2) Login (récupérer un access token)

```powershell
$BASE = "http://localhost:3000"

$login = Invoke-RestMethod -Method Post -Uri "$BASE/auth/login" -ContentType "application/json" -Body '{"email":"alice@example.com","password":"motdepasse"}'

if ($login.must_change_password -eq $true) {
  $resetHeaders = @{ Authorization = "Bearer $($login.reset_token)" }
  $changed = Invoke-RestMethod -Method Post -Uri "$BASE/auth/change-password" -Headers $resetHeaders -ContentType "application/json" -Body '{"newPassword":"NouveauMotDePasse123!"}'
  $token = $changed.access_token
} else {
  $token = $login.access_token
}

$headers = @{ Authorization = "Bearer $token" }
```

3) Vérifier l'utilisateur courant

```powershell
Invoke-RestMethod -Method Get -Uri "$BASE/auth/me" -Headers $headers
```

4) Créer une équipe (requiert un token `admin` ou `manager`)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/equipes" -Headers $headers -ContentType "application/json" -Body '{"id_equipe":"eq_support","nom":"Support"}'
# ou (curl binaire)
curl.exe -X POST "$BASE/equipes" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_equipe":"eq_support","nom":"Support"}'
```

5) Créer un rôle (IDs canoniques recommandés)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/roles" -Headers $headers -ContentType "application/json" -Body '{"id_role":"agent","libelle":"Agent"}'
# ou (curl binaire)
curl.exe -X POST "$BASE/roles" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_role":"agent","libelle":"Agent"}'
```

6) Créer un utilisateur (lié à l'équipe) (admin uniquement)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/utilisateurs" -Headers $headers -ContentType "application/json" -Body '{"id_utilisateur":"u_alice","nom":"Alice","prenom":"Dupont","email":"alice@example.com","id_equipe":"eq_support"}'
# ou (curl binaire)
curl.exe -X POST "$BASE/utilisateurs" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_utilisateur":"u_alice","nom":"Alice","prenom":"Dupont","email":"alice@example.com","id_equipe":"eq_support"}'
```

7) Assigner un rôle à l'utilisateur (admin uniquement)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/utilisateurs/u_alice/roles" -Headers $headers -ContentType "application/json" -Body '{"id_role":"agent"}'
Invoke-RestMethod -Method Get -Uri "$BASE/utilisateurs/u_alice/roles" -Headers $headers
# ou (curl binaire)
curl.exe -X POST "$BASE/utilisateurs/u_alice/roles" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_role":"agent"}'
curl.exe "$BASE/utilisateurs/u_alice/roles" -H "Authorization: Bearer $token"
```

8) Créer une catégorie (liée à l'équipe) (admin/manager)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/categories" -Headers $headers -ContentType "application/json" -Body '{"id_categorie":"cat_app","libelle":"Application","id_equipe":"eq_support"}'
# ou (curl binaire)
curl.exe -X POST "$BASE/categories" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_categorie":"cat_app","libelle":"Application","id_equipe":"eq_support"}'
```

9) Créer un ticket (créateur imposé par le JWT)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/tickets" -Headers $headers -ContentType "application/json" -Body '{"id_ticket":"t_001","titre":"Bug connexion","etat":"nouveau","id_categorie":"cat_app"}'
Invoke-RestMethod -Method Get -Uri "$BASE/tickets/t_001" -Headers $headers
# ou (curl binaire)
curl.exe -X POST "$BASE/tickets" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_ticket":"t_001","titre":"Bug connexion","etat":"nouveau","id_categorie":"cat_app"}'
curl.exe "$BASE/tickets/t_001" -H "Authorization: Bearer $token"
```

10) Assigner puis désassigner un agent (Manager+)

```bash
Invoke-RestMethod -Method Patch -Uri "$BASE/tickets/t_001" -Headers $headers -ContentType "application/json" -Body '{"id_agent_assigne":"u_alice"}'
Invoke-RestMethod -Method Patch -Uri "$BASE/tickets/t_001" -Headers $headers -ContentType "application/json" -Body '{"id_agent_assigne":null}'
# ou (curl binaire)
curl.exe -X PATCH "$BASE/tickets/t_001" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_agent_assigne":"u_alice"}'
curl.exe -X PATCH "$BASE/tickets/t_001" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_agent_assigne":null}'
```

11) Créer un message (auteur imposé par le JWT)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/messages" -Headers $headers -ContentType "application/json" -Body '{"id_message":"m_001","contenu":"Je n''arrive pas à me connecter","visibilite":"public","id_ticket":"t_001"}'
Invoke-RestMethod -Method Get -Uri "$BASE/messages/m_001" -Headers $headers
# ou (curl binaire)
curl.exe -X POST "$BASE/messages" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_message":"m_001","contenu":"Je ne parviens pas à me connecter","visibilite":"public","id_ticket":"t_001"}'
curl.exe "$BASE/messages/m_001" -H "Authorization: Bearer $token"
```

12) Créer une pièce jointe (auteur imposé par le JWT)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/piece-jointes" -Headers $headers -ContentType "application/json" -Body '{"id_piece_jointe":"pj_001","nom_fichier":"capture.png","url_path":"/uploads/capture.png","id_ticket":"t_001"}'
Invoke-RestMethod -Method Get -Uri "$BASE/piece-jointes/pj_001" -Headers $headers
# ou (curl binaire)
curl.exe -X POST "$BASE/piece-jointes" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_piece_jointe":"pj_001","nom_fichier":"capture.png","url_path":"/uploads/capture.png","id_ticket":"t_001"}'
curl.exe "$BASE/piece-jointes/pj_001" -H "Authorization: Bearer $token"
```

13) Ajouter une entrée d'historique (append-only) (admin uniquement)

```bash
Invoke-RestMethod -Method Post -Uri "$BASE/historique-actions" -Headers $headers -ContentType "application/json" -Body '{"id_action":"ha_001","type_action":"creation_ticket","detail":"Ticket créé","id_cible":"u_alice","id_auteur":"u_alice","id_ticket":"t_001"}'
Invoke-RestMethod -Method Get -Uri "$BASE/historique-actions/ha_001" -Headers $headers
# ou (curl binaire)
curl.exe -X POST "$BASE/historique-actions" -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"id_action":"ha_001","type_action":"creation_ticket","detail":"Ticket créé","id_cible":"u_alice","id_auteur":"u_alice","id_ticket":"t_001"}'
curl.exe "$BASE/historique-actions/ha_001" -H "Authorization: Bearer $token"
```

14) Nettoyage (optionnel)

```bash
Invoke-RestMethod -Method Delete -Uri "$BASE/messages/m_001" -Headers $headers
Invoke-RestMethod -Method Delete -Uri "$BASE/piece-jointes/pj_001" -Headers $headers
Invoke-RestMethod -Method Delete -Uri "$BASE/tickets/t_001" -Headers $headers
Invoke-RestMethod -Method Delete -Uri "$BASE/categories/cat_app" -Headers $headers
Invoke-RestMethod -Method Delete -Uri "$BASE/utilisateurs/u_alice/roles/agent" -Headers $headers
Invoke-RestMethod -Method Delete -Uri "$BASE/utilisateurs/u_alice" -Headers $headers
Invoke-RestMethod -Method Delete -Uri "$BASE/roles/agent" -Headers $headers
Invoke-RestMethod -Method Delete -Uri "$BASE/equipes/eq_support" -Headers $headers
```

## Attribution / licence

Ce dépôt a été initialisé à partir du starter NestJS. NestJS est distribué sous licence MIT :
https://github.com/nestjs/nest/blob/master/LICENSE
