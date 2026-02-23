import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketRepository } from './tickets.repository';
import { Prisma } from '@prisma/client';


@Injectable()
export class TicketsService {
  constructor(private readonly repo: TicketRepository) {}

  create(dto: CreateTicketDto) {
    const data: Prisma.ticketsCreateInput = {
      id_ticket: dto.id_ticket,
      titre: dto.titre,
      etat: dto.etat,
      resultat: dto.resultat,
      archived_at: dto.archived_at,
      categories: {
        connect: { id_categorie: dto.id_categorie },
      },
      utilisateurs_tickets_id_createurToutilisateurs: {
        connect: { id_utilisateur: dto.id_createur },
      },
    };
    if (dto.id_agent_assigne !== undefined && dto.id_agent_assigne !== null) {
      data.utilisateurs_tickets_id_agent_assigneToutilisateurs = {
        connect: { id_utilisateur: dto.id_agent_assigne },
      };
    }

    return this.repo.create(data);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id_ticket: string) {
    const ticket = await this.repo.findById(id_ticket);
    if (!ticket) throw new NotFoundException('Ticket non trouvé')
      return ticket;
  }

  async update(id_ticket: string, dto: UpdateTicketDto) {
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

      return await this.repo.updateById(id_ticket, data);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Ticket non trouvé')
      }
      throw err;
    }
  }

  async remove(id_ticket: string) {
    try {
      return await this.repo.deleteById(id_ticket);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Ticket non trouvé')
      }
      throw err;
    }
  }
}
