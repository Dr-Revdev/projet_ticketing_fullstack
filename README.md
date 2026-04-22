# TicketSup

Application web de gestion de tickets de support informatique, permettant de créer, attribuer et suivre les demandes des utilisateurs.  
Projet réalisé dans le cadre du BTS SIO.

## Problématique

Une entreprise souhaite centraliser ses demandes de support informatique au sein d’une application unique.

Les besoins identifiés sont les suivants :
- gérer les utilisateurs et leurs rôles ;
- orienter les tickets vers les équipes concernées selon le type de demande ;
- permettre à un manager de répartir les tickets entre les agents de son équipe ;
- assurer un suivi du traitement des demandes et des actions réalisées.

## Fonctionnalités

- Authentification des utilisateurs
- Création, consultation et modification de tickets
- Gestion des rôles
- Gestion des utilisateurs
- Attribution des tickets aux agents
- Suivi du statut des demandes
- Ajout de pièces jointes
- Historique des actions effectuées sur les tickets

## Rôles utilisateurs

- **Administrateur** : gère les utilisateurs, les rôles et les paramètres globaux
- **Manager** : distribue les tickets aux agents de son équipe
- **Agent** : prend en charge et traite les tickets qui lui sont attribués
- **Utilisateur** : crée et consulte ses demandes de support

## Technologies utilisées

- **Frontend** : React, TypeScript, Vite, Material UI
- **Backend** : Node.js, NestJS, Prisma
- **Base de données** : MySQL
- **Authentification** : JWT

## Choix techniques

- **React** a été utilisé pour construire une interface dynamique, modulaire et réactive.
- **TypeScript** permet de renforcer la fiabilité du code grâce au typage statique.
- **NestJS** a été choisi pour structurer le backend de manière claire, avec une séparation propre entre les contrôleurs, les services et les modules.
- **Prisma** facilite l’accès à la base de données ainsi que la gestion des modèles et des relations.
- **JWT** permet de sécuriser l’authentification des utilisateurs et l’accès aux routes protégées.
- **MySQL** assure le stockage structuré des données de l’application.

## Installation

### Prérequis

- Node.js
- npm
- MySQL

### Étapes

1. Cloner le dépôt :

```bash
git clone <url-du-depot>
cd projetTicket
```

2. Installer les dépendances du backend :

```bash
cd backend
npm install
```

3. Installer les dépendances du frontend :

```bash
cd ../frontend
npm install
```

4. Configurer les fichiers `.env` du frontend et du backend à partir des fichiers `.env.example`.

5. Créer et initialiser la base de données MySQL à l’aide de l’extraction SQL fournie.

6. Lancer le backend :

```bash
cd backend
npm run start
```

7. Lancer le frontend :

```bash
cd frontend
npm run dev
```

## Configuration

Le frontend et le backend nécessitent chacun un fichier `.env`.  
Ces fichiers doivent être créés à partir des modèles fournis dans les fichiers `.env.example`.

## Utilisation

Une fois l’application démarrée, il est possible de :
- se connecter avec un compte utilisateur ;
- créer une demande de support ;
- attribuer un ticket à un agent ;
- mettre à jour l’état d’avancement d’un ticket ;
- consulter l’historique des actions ;
- échanger via le système de messages associé au ticket.

## Structure du projet

```text
projetTicket/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── test/
├── bruno/
├── frontend/
│   └── src/
└── README.md
```

## Organisation technique

- `backend/` : contient l’API, la logique métier, les contrôleurs, les services et la configuration Prisma
- `frontend/` : contient l’interface utilisateur développée avec React
- `bruno/` : contient la collection de tests API
- `backend/prisma/` : contient le schéma de base de données et les éléments liés à l’ORM

## Tests

Les routes de l’API ont été testées à l’aide de **Bruno**.  
La collection de requêtes est disponible dans le dossier `bruno/`.

## Limites actuelles

- Absence de pagination
- Absence de tests automatisés
- Pas de distinction entre messages publics et messages internes
- Gestion des erreurs encore perfectible

## Pistes d’amélioration

- Mise en place de notifications par e-mail
- Ajout de tests unitaires et de tests d’intégration
- Mise en place d’une chaîne CI/CD
- Amélioration de la gestion des erreurs
- Ajout d’une meilleure gestion de la confidentialité des échanges

## Auteur

Projet réalisé dans le cadre du BTS SIO.
