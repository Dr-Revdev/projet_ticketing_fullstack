# Backend — Projet Ticket

API backend (helpdesk/tickets) construite avec NestJS + Prisma (MySQL/MariaDB).

## Prérequis

- Node.js (LTS) + npm
- Base MySQL/MariaDB accessible
- Variable d'environnement `DATABASE_URL` (connexion Prisma)

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

### Prérequis

- Les identifiants (`id_*`) sont des chaînes et sont fournis par le client dans les DTO de création.

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

### Règles/validations importantes

- `tickets.etat` est validé côté DTO (liste autorisée), car les `CHECK` SQL ne sont pas gérés par Prisma.
- `messages.visibilite` est validé côté DTO (`public` | `interne`).
- Sur `PATCH /tickets/:id`, `id_agent_assigne: null` désassigne l'agent (disconnect).

## Règles métier & autorisations (v1)

### Rôles (pyramide)

Les rôles sont hiérarchiques : `Admin` ⟶ `Manager` ⟶ `Agent` ⟶ `User`.
Un rôle hérite des droits des rôles en-dessous.

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
- **Modification par User** : aucune (hors ouverture). Les informations complémentaires passent par des messages.
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

2) Créer une équipe

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/equipes" -ContentType "application/json" -Body '{"id_equipe":"eq_support","nom":"Support"}'
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/equipes -H "Content-Type: application/json" -d '{"id_equipe":"eq_support","nom":"Support"}'
```

3) Créer un rôle

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/roles" -ContentType "application/json" -Body '{"id_role":"role_agent","libelle":"Agent"}'
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/roles -H "Content-Type: application/json" -d '{"id_role":"role_agent","libelle":"Agent"}'
```

4) Créer un utilisateur (lié à l'équipe)

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/utilisateurs" -ContentType "application/json" -Body '{"id_utilisateur":"u_alice","nom":"Alice","prenom":"Dupont","email":"alice@example.com","id_equipe":"eq_support"}'
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/utilisateurs -H "Content-Type: application/json" -d '{"id_utilisateur":"u_alice","nom":"Alice","prenom":"Dupont","email":"alice@example.com","id_equipe":"eq_support"}'
```

5) Assigner un rôle à l'utilisateur

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/utilisateurs/u_alice/roles" -ContentType "application/json" -Body '{"id_role":"role_agent"}'
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/utilisateurs/u_alice/roles"
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/utilisateurs/u_alice/roles -H "Content-Type: application/json" -d '{"id_role":"role_agent"}'
curl.exe http://localhost:3000/utilisateurs/u_alice/roles
```

6) Créer une catégorie (liée à l'équipe)

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/categories" -ContentType "application/json" -Body '{"id_categorie":"cat_app","libelle":"Application","id_equipe":"eq_support"}'
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/categories -H "Content-Type: application/json" -d '{"id_categorie":"cat_app","libelle":"Application","id_equipe":"eq_support"}'
```

7) Créer un ticket (lié au créateur + catégorie)

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/tickets" -ContentType "application/json" -Body '{"id_ticket":"t_001","titre":"Bug connexion","etat":"nouveau","id_createur":"u_alice","id_categorie":"cat_app"}'
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/tickets/t_001"
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/tickets -H "Content-Type: application/json" -d '{"id_ticket":"t_001","titre":"Bug connexion","etat":"nouveau","id_createur":"u_alice","id_categorie":"cat_app"}'
curl.exe http://localhost:3000/tickets/t_001
```

8) Assigner puis désassigner un agent

```bash
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/tickets/t_001" -ContentType "application/json" -Body '{"id_agent_assigne":"u_alice"}'
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/tickets/t_001" -ContentType "application/json" -Body '{"id_agent_assigne":null}'
# ou (curl binaire)
curl.exe -X PATCH http://localhost:3000/tickets/t_001 -H "Content-Type: application/json" -d '{"id_agent_assigne":"u_alice"}'
curl.exe -X PATCH http://localhost:3000/tickets/t_001 -H "Content-Type: application/json" -d '{"id_agent_assigne":null}'
```

9) Créer un message (immutabilité)

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/messages" -ContentType "application/json" -Body '{"id_message":"m_001","contenu":"Je n''arrive pas à me connecter","visibilite":"public","id_utilisateur":"u_alice","id_ticket":"t_001"}'
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/messages/m_001"
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/messages -H "Content-Type: application/json" -d '{"id_message":"m_001","contenu":"Je ne parviens pas à me connecter","visibilite":"public","id_utilisateur":"u_alice","id_ticket":"t_001"}'
curl.exe http://localhost:3000/messages/m_001
```

10) Créer une pièce jointe

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/piece-jointes" -ContentType "application/json" -Body '{"id_piece_jointe":"pj_001","nom_fichier":"capture.png","url_path":"/uploads/capture.png","id_utilisateur":"u_alice","id_ticket":"t_001"}'
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/piece-jointes/pj_001"
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/piece-jointes -H "Content-Type: application/json" -d '{"id_piece_jointe":"pj_001","nom_fichier":"capture.png","url_path":"/uploads/capture.png","id_utilisateur":"u_alice","id_ticket":"t_001"}'
curl.exe http://localhost:3000/piece-jointes/pj_001
```

11) Ajouter une entrée d'historique (append-only)

```bash
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/historique-actions" -ContentType "application/json" -Body '{"id_action":"ha_001","type_action":"creation_ticket","detail":"Ticket créé","id_cible":"u_alice","id_auteur":"u_alice","id_ticket":"t_001"}'
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/historique-actions/ha_001"
# ou (curl binaire)
curl.exe -X POST http://localhost:3000/historique-actions -H "Content-Type: application/json" -d '{"id_action":"ha_001","type_action":"creation_ticket","detail":"Ticket créé","id_cible":"u_alice","id_auteur":"u_alice","id_ticket":"t_001"}'
curl.exe http://localhost:3000/historique-actions/ha_001
```

12) Nettoyage (optionnel)

```bash
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/messages/m_001"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/piece-jointes/pj_001"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/tickets/t_001"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/categories/cat_app"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/utilisateurs/u_alice/roles/role_agent"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/utilisateurs/u_alice"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/roles/role_agent"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/equipes/eq_support"
```

## Attribution / licence

Ce dépôt a été initialisé à partir du starter NestJS. NestJS est distribué sous licence MIT :
https://github.com/nestjs/nest/blob/master/LICENSE
