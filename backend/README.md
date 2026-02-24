<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Socle CRUD (API)

### Prérequis

- Variable d'environnement `DATABASE_URL` (connexion MariaDB/MySQL pour Prisma).
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
curl.exe -X POST http://localhost:3000/messages -H "Content-Type: application/json" -d '{"id_message":"m_001","contenu":"Je n\u0027arrive pas à me connecter","visibilite":"public","id_utilisateur":"u_alice","id_ticket":"t_001"}'
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

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
