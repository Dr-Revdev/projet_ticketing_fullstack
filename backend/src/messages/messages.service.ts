import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageRepository } from './message.repository';
import { Prisma } from '@prisma/client';
import { AccessService } from 'src/access/access.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly repo: MessageRepository,
    private readonly access: AccessService,
  ) { }

  async createForUser(userId: string, dto: CreateMessageDto) {
    const ctx = await this.access.getUserContext(userId);

    if (dto.id_utilisateur && dto.id_utilisateur !== userId) {
      throw new ForbiddenException("id_utilisateur ne peut pas être un autre utilisateur");
    }

    await this.access.assertCanReadTicket(ctx, dto.id_ticket);

    if (dto.visibilite === 'interne' && !this.access.canSeeInternalMessages(ctx)) {
      throw new ForbiddenException("visibilite=interne réservé au staff (Agent+)");
    }

    const data: Prisma.messagesCreateInput = {
      id_message: randomUUID(),
      contenu: dto.contenu,
      visibilite: dto.visibilite,
      utilisateurs: {
        connect: { id_utilisateur: userId },
      },
      tickets: {
        connect: { id_ticket: dto.id_ticket },
      },
    };

    const message = await this.repo.create(data);
    return this.repo.findByIdWith({
      where: { id_message: message.id_message },
      include: {
        utilisateurs: {
          select: { id_utilisateur: true, nom: true, prenom: true }
        }
      }
    });
  }

  async findAllForUser(userId: string, id_ticket?: string) {
    const ctx = await this.access.getUserContext(userId);

    const where: Prisma.messagesWhereInput = {
      tickets: this.access.ticketWhereFor(ctx),
    };

    if (id_ticket) {
      where.id_ticket = id_ticket;
    }

    if (!this.access.canSeeInternalMessages(ctx)) {
      where.visibilite = 'public';
    }

    return this.repo.findMany({ 
      where,
      include: {
        utilisateurs: {
          select: { id_utilisateur: true, nom: true, prenom: true }
        }
      },
      orderBy: { date_message: 'asc' }
    });
  }

  async findOneForUser(userId: string, id_message: string) {
    const ctx = await this.access.getUserContext(userId);
    const message = await this.repo.findByIdWith({
      where: { id_message },
      include: {
        tickets: {
          select: {
            id_createur: true,
            id_agent_assigne: true,
            categories: { select: { id_equipe: true } },
          },
        },
      },
    });
    if (!message) throw new NotFoundException('Message non trouvé');

    const okTicket = await this.access.canReadTicketFromLoaded(ctx, message.tickets);
    if (!okTicket) throw new ForbiddenException('Accès interdit au ticket');

    if (message.visibilite === 'interne' && !this.access.canSeeInternalMessages(ctx)) {
      throw new ForbiddenException('Accès interdit (message interne)');
    }
    return message;
  }

  async remove(id_message: string) {
    try {
      return await this.repo.deleteById(id_message);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Message non trouvé');
      }
      throw err;
    }
  }
}
