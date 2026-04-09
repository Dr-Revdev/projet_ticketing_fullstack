import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketRepository } from './tickets.repository';
import { Prisma } from '@prisma/client';
import { AccessService } from 'src/access/access.service';
import { randomUUID } from 'node:crypto';
import { HistoriqueActionsService } from 'src/historique-actions/historique-actions.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly repo: TicketRepository,
    private readonly access: AccessService,
    private readonly historique: HistoriqueActionsService,
  ) { }

  async createForUser(userId: string, dto: CreateTicketDto) {
    const ctx = await this.access.getUserContext(userId);

    // Le créateur vient du JWT.
    if (dto.id_createur && dto.id_createur !== userId) {
      throw new ForbiddenException("id_createur ne peut pas être un autre utilisateur");
    }

    // En v1 (README): création User+ mais sans assignation/résultat par un User.
    if (!this.access.hasAtLeast(ctx, 'agent')) {
      if (dto.etat !== 'nouveau') {
        throw new ForbiddenException("Un User ne peut créer qu'avec etat=nouveau");
      }
      if (dto.resultat !== undefined) {
        throw new ForbiddenException('Un User ne peut pas définir resultat à la création');
      }
      if (dto.id_agent_assigne !== undefined) {
        throw new ForbiddenException("Un User ne peut pas assigner un ticket à la création");
      }
    } else if (!this.access.hasAtLeast(ctx, 'manager')) {
      // Agent+: pas d'assignation (Manager+) sauf si tu ajoutes une action métier dédiée (claim).
      if (dto.id_agent_assigne !== undefined) {
        throw new ForbiddenException('Assignation/désassignation réservée à Manager+');
      }
    }

    const data: Prisma.ticketsCreateInput = {
      id_ticket: randomUUID(),
      titre: dto.titre,
      etat: dto.etat,
      resultat: dto.resultat,
      archived_at: dto.archived_at,
      categories: {
        connect: { id_categorie: dto.id_categorie },
      },
      utilisateurs_tickets_id_createurToutilisateurs: {
        connect: { id_utilisateur: userId },
      },
    };
    if (dto.id_agent_assigne !== undefined && dto.id_agent_assigne !== null) {
      data.utilisateurs_tickets_id_agent_assigneToutilisateurs = {
        connect: { id_utilisateur: dto.id_agent_assigne },
      };
    }

    const ticket = await this.repo.create(data);

    await this.historique.create({
      id_action: randomUUID(),
      type_action: 'creation',
      detail: ticket.titre,
      id_auteur: userId,
      id_cible: userId,
      id_ticket: ticket.id_ticket,
    })

    return ticket;
  }

  async findAllForUser(userId: string, filters: { etat?: string, id_categorie?: string, titre?: string } = {}) {
    const ctx = await this.access.getUserContext(userId);

    const where: Prisma.ticketsWhereInput = {
      ...this.access.ticketWhereFor(ctx),
    }

    if (filters.etat) where.etat = filters.etat
    if (filters.id_categorie) where.id_categorie = filters.id_categorie
    if (filters.titre) where.titre = { contains: filters.titre }

    return this.repo.findMany({ 
      where,
      include: { categories: { select: { libelle: true } } }
    });
  }

  async findOneForUser(userId: string, id_ticket: string) {
    const ctx = await this.access.getUserContext(userId);
    await this.access.assertCanReadTicket(ctx, id_ticket);

    const ticket = await this.repo.findByIdWith({
      where: {id_ticket},
      include: { categories: { select: { libelle: true } } }
    });
    if (!ticket) throw new NotFoundException('Ticket non trouvé');
    return ticket;
  }

  async updateForUser(userId: string, id_ticket: string, dto: UpdateTicketDto) {
    const ctx = await this.access.getUserContext(userId);

    const ticketAccess = await this.access.getTicketForAccess(id_ticket);
    if (!ticketAccess) throw new NotFoundException('Ticket non trouvé');
    const okRead = await this.access.canReadTicketFromLoaded(ctx, ticketAccess);
    if (!okRead) throw new ForbiddenException('Accès interdit au ticket');

    // Règles PATCH (README v1)
    const touches = {
      titre: dto.titre !== undefined,
      etat: dto.etat !== undefined,
      resultat: dto.resultat !== undefined,
      archived_at: dto.archived_at !== undefined,
      id_categorie: dto.id_categorie !== undefined,
      id_createur: dto.id_createur !== undefined,
      id_agent_assigne: dto.id_agent_assigne !== undefined,
    };

    if (!this.access.hasAtLeast(ctx, 'agent')) {
      // User: aucune modif sauf fermeture (etat=ferme) sous conditions.
      const anyOther = touches.titre || touches.resultat || touches.archived_at || touches.id_categorie || touches.id_createur || touches.id_agent_assigne;
      if (anyOther) throw new ForbiddenException('Un User ne peut pas modifier un ticket (hors fermeture)');
      if (!touches.etat || dto.etat !== 'ferme') {
        throw new ForbiddenException('Un User ne peut que fermer un ticket (etat=ferme)');
      }
      const allowedPrev = new Set(['nouveau', 'en_attente', 'en_cours']);
      if (!allowedPrev.has(ticketAccess.etat)) {
        throw new ForbiddenException('Fermeture interdite dans cet état');
      }
    } else {
      // Agent+: changement d'état/résultat OK
      if (touches.id_agent_assigne && !this.access.hasAtLeast(ctx, 'manager')) {
        throw new ForbiddenException('Assignation/désassignation réservée à Manager+');
      }
      if ((touches.id_categorie || touches.titre) && !this.access.hasAtLeast(ctx, 'manager')) {
        throw new ForbiddenException('Modification titre/catégorie réservée à Manager+');
      }
      if (touches.id_createur && !this.access.hasAtLeast(ctx, 'admin')) {
        throw new ForbiddenException('Changement de créateur réservé à Admin');
      }
    }

    try {
      const data: Prisma.ticketsUpdateInput = {};

      if (dto.titre !== undefined) data.titre = dto.titre;
      if (dto.etat !== undefined) data.etat = dto.etat;
      if (dto.resultat !== undefined) data.resultat = dto.resultat;
      if (dto.archived_at !== undefined) data.archived_at = dto.archived_at;

      if (dto.id_categorie !== undefined) {
        data.categories = { connect: { id_categorie: dto.id_categorie } };
      }

      if (dto.id_createur !== undefined) {
        data.utilisateurs_tickets_id_createurToutilisateurs = {
          connect: { id_utilisateur: dto.id_createur },
        };
      }

      if (dto.id_agent_assigne === null) {
        data.utilisateurs_tickets_id_agent_assigneToutilisateurs = {
          disconnect: true,
        };
      } else if (dto.id_agent_assigne !== undefined) {
        data.utilisateurs_tickets_id_agent_assigneToutilisateurs = {
          connect: { id_utilisateur: dto.id_agent_assigne },
        };
      }

      await this.repo.updateById(id_ticket, data);

      if (touches.etat) {
        await this.historique.create({
          id_action: randomUUID(),
          type_action: 'changement_etat',
          detail: `${ticketAccess.etat} -> ${dto.etat}`,
          id_auteur: userId,
          id_cible: userId,
          id_ticket,
        })
      }

      if (touches.id_agent_assigne) {
        await this.historique.create({
          id_action: randomUUID(),
          type_action: 'assignation',
          detail: dto.id_agent_assigne ?? 'désassigné',
          id_auteur: userId,
          id_cible: dto.id_agent_assigne ?? userId,
          id_ticket,
        })
      }

      return this.repo.findByIdWith({
        where: { id_ticket },
        include: { categories: { select: { libelle: true } } }
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Ticket non trouvé');
      }
      throw err;
    }
  }

  async removeForUser(userId: string, id_ticket: string) {
    const ctx = await this.access.getUserContext(userId);
    if (!this.access.isAdmin(ctx)) throw new ForbiddenException('Suppression réservée à Admin');

    try {
      return await this.repo.deleteById(id_ticket);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Ticket non trouvé');
      }
      throw err;
    }
  }
}
