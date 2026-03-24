-- CreateTable
CREATE TABLE `categories` (
    `id_categorie` VARCHAR(36) NOT NULL,
    `libelle` VARCHAR(50) NOT NULL,
    `id_equipe` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `uq_categories_equipe_libelle`(`id_equipe`, `libelle`),
    PRIMARY KEY (`id_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipes` (
    `id_equipe` VARCHAR(36) NOT NULL,
    `nom` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `nom`(`nom`),
    PRIMARY KEY (`id_equipe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historiqueactions` (
    `id_action` VARCHAR(36) NOT NULL,
    `type_action` VARCHAR(50) NOT NULL,
    `date_action` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `detail` VARCHAR(1000) NULL,
    `id_cible` VARCHAR(36) NOT NULL,
    `id_auteur` VARCHAR(36) NOT NULL,
    `id_ticket` VARCHAR(36) NOT NULL,

    INDEX `ix_actions_id_auteur`(`id_auteur`),
    INDEX `ix_actions_id_cible`(`id_cible`),
    INDEX `ix_actions_id_ticket`(`id_ticket`),
    PRIMARY KEY (`id_action`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id_message` VARCHAR(36) NOT NULL,
    `contenu` VARCHAR(4000) NOT NULL,
    `date_message` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `visibilite` VARCHAR(25) NOT NULL,
    `id_utilisateur` VARCHAR(36) NOT NULL,
    `id_ticket` VARCHAR(36) NOT NULL,

    INDEX `ix_messages_id_ticket`(`id_ticket`),
    INDEX `ix_messages_id_utilisateur`(`id_utilisateur`),
    INDEX `ix_messages_ticket_date`(`id_ticket`, `date_message`),
    PRIMARY KEY (`id_message`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `piecejointes` (
    `id_piece_jointe` VARCHAR(36) NOT NULL,
    `nom_fichier` VARCHAR(255) NOT NULL,
    `url_path` VARCHAR(255) NOT NULL,
    `date_upload` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_utilisateur` VARCHAR(36) NOT NULL,
    `id_ticket` VARCHAR(36) NOT NULL,

    INDEX `ix_pieces_id_ticket`(`id_ticket`),
    INDEX `ix_pieces_id_utilisateur`(`id_utilisateur`),
    PRIMARY KEY (`id_piece_jointe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_role` VARCHAR(36) NOT NULL,
    `libelle` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `libelle`(`libelle`),
    PRIMARY KEY (`id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id_ticket` VARCHAR(36) NOT NULL,
    `titre` VARCHAR(50) NOT NULL,
    `date_creation` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `resultat` VARCHAR(25) NULL,
    `etat` VARCHAR(25) NOT NULL,
    `archived_at` DATETIME(0) NULL,
    `id_createur` VARCHAR(36) NOT NULL,
    `id_categorie` VARCHAR(36) NOT NULL,
    `id_agent_assigne` VARCHAR(36) NULL,

    INDEX `ix_tickets_agent_etat`(`id_agent_assigne`, `etat`),
    INDEX `ix_tickets_etat_date`(`etat`, `date_creation`),
    INDEX `ix_tickets_id_agent_assigne`(`id_agent_assigne`),
    INDEX `ix_tickets_id_categorie`(`id_categorie`),
    INDEX `ix_tickets_id_createur`(`id_createur`),
    PRIMARY KEY (`id_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateurs` (
    `id_utilisateur` VARCHAR(36) NOT NULL,
    `nom` VARCHAR(50) NOT NULL,
    `prenom` VARCHAR(50) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `id_equipe` VARCHAR(36) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `derniere_connexion` DATETIME(0) NULL,
    `password_changed_at` DATETIME(0) NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `ix_utilisateurs_id_equipe`(`id_equipe`),
    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateurs_roles` (
    `id_utilisateur` VARCHAR(36) NOT NULL,
    `id_role` VARCHAR(36) NOT NULL,

    INDEX `ix_ur_id_role`(`id_role`),
    PRIMARY KEY (`id_utilisateur`, `id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `fk_categories_equipe` FOREIGN KEY (`id_equipe`) REFERENCES `equipes`(`id_equipe`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiqueactions` ADD CONSTRAINT `fk_actions_auteur_utilisateur` FOREIGN KEY (`id_auteur`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiqueactions` ADD CONSTRAINT `fk_actions_cible_utilisateur` FOREIGN KEY (`id_cible`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiqueactions` ADD CONSTRAINT `fk_actions_ticket` FOREIGN KEY (`id_ticket`) REFERENCES `tickets`(`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `fk_messages_ticket` FOREIGN KEY (`id_ticket`) REFERENCES `tickets`(`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `fk_messages_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `piecejointes` ADD CONSTRAINT `fk_pieces_ticket` FOREIGN KEY (`id_ticket`) REFERENCES `tickets`(`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `piecejointes` ADD CONSTRAINT `fk_pieces_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `fk_tickets_agent_assigne` FOREIGN KEY (`id_agent_assigne`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `fk_tickets_categorie` FOREIGN KEY (`id_categorie`) REFERENCES `categories`(`id_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `fk_tickets_createur` FOREIGN KEY (`id_createur`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilisateurs` ADD CONSTRAINT `fk_utilisateurs_equipe` FOREIGN KEY (`id_equipe`) REFERENCES `equipes`(`id_equipe`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilisateurs_roles` ADD CONSTRAINT `fk_ur_role` FOREIGN KEY (`id_role`) REFERENCES `roles`(`id_role`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilisateurs_roles` ADD CONSTRAINT `fk_ur_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;
