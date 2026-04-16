import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageRepository } from './message.repository';
import { Prisma } from '@prisma/client';
import { AccessService } from '../access/access.service';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly repo: MessageRepository,
    private readonly access: AccessService,
    private readonly prisma: PrismaService,
  ) { }

  async createForUser(userId: string, dto: CreateMessageDto) {
    const [ctx, auteur] = await Promise.all([
      this.access.getUserContext(userId),
      this.prisma.utilisateurs.findUnique({
        where: { id_utilisateur: userId },
        select: { id_utilisateur: true, nom: true, prenom: true }
      })
    ]);

    await this.access.assertCanReadTicket(ctx, dto.id_ticket);

    if (dto.visibilite === 'interne' && !this.access.canSeeInternalMessages(ctx)) {
      throw new ForbiddenException("visibilite=interne réservé au staff (Agent+)");
    }

    const id_message = randomUUID()

    const data: Prisma.messagesUncheckedCreateInput = {
      id_message,
      contenu: dto.contenu,
      visibilite: dto.visibilite,
      id_utilisateur: userId,
      id_ticket: dto.id_ticket,
    };

    await this.repo.create(data);

    return {
      id_message,
      contenu: dto.contenu,
      visibilite: dto.visibilite,
      date_message: new Date(),
      id_utilisateur: userId,
      id_ticket: dto.id_ticket,
      utilisateurs: auteur!,
    };
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
    const existing = await this.repo.findById(id_message);
    if (!existing) throw new NotFoundException('Message non trouvé');
    return this.repo.deleteById(id_message);
  }
}
