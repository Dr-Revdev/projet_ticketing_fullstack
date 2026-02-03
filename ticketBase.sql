CREATE DATABASE IF NOT EXISTS ticketBase CHARACTER 
SET utf8mb4 
COLLATE utf8mb4_0900_ai_ci;
USE ticketBase;

SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ZERO_IN_DATE';

CREATE TABLE equipes (
    id_equipe VARCHAR(25) PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE roles (
    id_role VARCHAR(25) PRIMARY KEY,
    libelle VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE utilisateurs (
    id_utilisateur VARCHAR(25) PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    id_equipe VARCHAR(25) NOT NULL,
    CONSTRAINT fk_utilisateurs_equipe
        FOREIGN KEY (id_equipe) REFERENCES equipes(id_equipe)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB;
CREATE INDEX ix_utilisateurs_id_equipe ON utilisateurs(id_equipe);

CREATE TABLE categories (
    id_categorie VARCHAR(25) PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL,
    id_equipe VARCHAR(25) NOT NULL,

    CONSTRAINT uq_categories_equipe_libelle UNIQUE (id_equipe, libelle),
    
    CONSTRAINT fk_categories_equipe
        FOREIGN KEY (id_equipe) 
        REFERENCES equipes(id_equipe) 
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tickets (
    id_ticket VARCHAR(25) PRIMARY KEY,
    titre VARCHAR(50) NOT NULL,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resultat VARCHAR(25),
    etat VARCHAR(25) NOT NULL,
    archived_at DATETIME,
    id_createur VARCHAR(25) NOT NULL,
    id_categorie VARCHAR(25) NOT NULL,
    id_agent_assigne VARCHAR(25),

    CONSTRAINT fk_tickets_createur
        FOREIGN KEY (id_createur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_categorie
        FOREIGN KEY (id_categorie) 
        REFERENCES categories(id_categorie)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_tickets_agent_assigne
        FOREIGN KEY (id_agent_assigne) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_tickets_etat
        CHECK (etat IN ('nouveau','en_cours','en_attente','resolu','ferme'))
) ENGINE=InnoDB;
CREATE INDEX ix_tickets_id_createur ON tickets(id_createur);
CREATE INDEX ix_tickets_id_categorie ON tickets(id_categorie);
CREATE INDEX ix_tickets_id_agent_assigne ON tickets(id_agent_assigne);
CREATE INDEX ix_tickets_etat_date ON tickets(etat, date_creation);
CREATE INDEX ix_tickets_agent_etat ON tickets(id_agent_assigne, etat);

CREATE TABLE messages (
    id_message VARCHAR(25) PRIMARY KEY,
    contenu VARCHAR(4000) NOT NULL,
    date_message DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    visibilite VARCHAR(25) NOT NULL,
    id_utilisateur VARCHAR(25) NOT NULL,
    id_ticket VARCHAR(25) NOT NULL,

    CONSTRAINT fk_messages_utilisateur
        FOREIGN KEY (id_utilisateur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_messages_ticket
        FOREIGN KEY (id_ticket) 
        REFERENCES tickets(id_ticket)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_messages_visibilite
        CHECK (visibilite IN ('public', 'interne'))
) ENGINE=InnoDB;
CREATE INDEX ix_messages_id_utilisateur ON messages(id_utilisateur);
CREATE INDEX ix_messages_id_ticket ON messages(id_ticket);
CREATE INDEX ix_messages_ticket_date ON messages(id_ticket, date_message);

CREATE TABLE pieceJointes (
    id_piece_jointe VARCHAR(25) PRIMARY KEY,
    nom_fichier VARCHAR(255) NOT NULL,
    url_path VARCHAR(255) NOT NULL,
    date_upload DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur VARCHAR(25) NOT NULL,
    id_ticket VARCHAR(25) NOT NULL,

    CONSTRAINT fk_pieces_utilisateur
        FOREIGN KEY (id_utilisateur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_pieces_ticket
        FOREIGN KEY (id_ticket) 
        REFERENCES tickets(id_ticket)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
CREATE INDEX ix_pieces_id_utilisateur ON pieceJointes(id_utilisateur);
CREATE INDEX ix_pieces_id_ticket ON pieceJointes(id_ticket);

CREATE TABLE historiqueActions (
    id_action VARCHAR(25) PRIMARY KEY,
    type_action VARCHAR(50) NOT NULL,
    date_action DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detail VARCHAR(1000),
    id_cible VARCHAR(25) NOT NULL,
    id_auteur VARCHAR(25) NOT NULL,
    id_ticket VARCHAR(25) NOT NULL,

    CONSTRAINT fk_actions_cible_utilisateur
        FOREIGN KEY (id_cible) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_actions_auteur_utilisateur
        FOREIGN KEY (id_auteur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_actions_ticket
        FOREIGN KEY (id_ticket) 
        REFERENCES tickets(id_ticket)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
CREATE INDEX ix_actions_id_cible ON historiqueActions(id_cible);
CREATE INDEX ix_actions_id_auteur ON historiqueActions(id_auteur);
CREATE INDEX ix_actions_id_ticket ON historiqueActions(id_ticket);

CREATE TABLE utilisateurs_roles (
    id_utilisateur VARCHAR(25) NOT NULL,
    id_role VARCHAR(25) NOT NULL,

    PRIMARY KEY (id_utilisateur, id_role),

    CONSTRAINT fk_ur_utilisateur
        FOREIGN KEY (id_utilisateur) 
        REFERENCES utilisateurs(id_utilisateur)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_ur_role
        FOREIGN KEY (id_role) 
        REFERENCES roles(id_role)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
CREATE INDEX ix_ur_id_role ON utilisateurs_roles(id_role);
