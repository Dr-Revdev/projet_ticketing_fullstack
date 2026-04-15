import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, tickets as TicketModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CanonicalRole, ROLE_LEVEL, isCanonicalRole, maxRoleLevel } from '../auth/roles.utils';

export type { CanonicalRole };


export interface UserAccessContext {
  userId: string;
  roleIds: string[];
  roleLevel: number;
  equipeId: string | null;
}

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserContext(userId: string): Promise<UserAccessContext> {
    const [roleIds, user] = await Promise.all([
      this.getUserRoleIds(userId),
      this.prisma.utilisateurs.findUnique({
        where: { id_utilisateur: userId },
        select: { id_equipe: true },
      }),
    ]);

    return {
      userId,
      roleIds,
      roleLevel: maxRoleLevel(roleIds),
      equipeId: user?.id_equipe ?? null,
    };
  }

  async getUserRoleIds(userId: string): Promise<string[]> {
    const links = await this.prisma.utilisateurs_roles.findMany({
      where: { id_utilisateur: userId },
      select: { roles: {select: { libelle: true} } },
    });

    return links.map((x) => x.roles.libelle);
  }

  hasAtLeast(ctx: UserAccessContext, minRole: CanonicalRole): boolean {
    return ctx.roleLevel >= ROLE_LEVEL[minRole];
  }

  isAdmin(ctx: UserAccessContext): boolean {
    return this.hasAtLeast(ctx, 'admin');
  }

  ticketWhereFor(ctx: UserAccessContext): Prisma.ticketsWhereInput {
    if (this.hasAtLeast(ctx, 'admin')) return {};

    if (this.hasAtLeast(ctx, 'manager')) {
      if (!ctx.equipeId) return { id_ticket: '__none__' };
      return { categories: { id_equipe: ctx.equipeId } };
    }

    if (this.hasAtLeast(ctx, 'agent')) {
      if (!ctx.equipeId) return { id_ticket: '__none__' };
      return {
        OR: [
          { id_agent_assigne: ctx.userId },
          { id_agent_assigne: null, categories: { id_equipe: ctx.equipeId } },
        ],
      };
    }

    return { id_createur: ctx.userId };
  }

  async getTicketForAccess(id_ticket: string) {
    return this.prisma.tickets.findUnique({
      where: { id_ticket },
      select: {
        id_ticket: true,
        etat: true,
        id_createur: true,
        id_agent_assigne: true,
        categories: { select: { id_equipe: true } },
      },
    });
  }

  async assertCanReadTicket(ctx: UserAccessContext, id_ticket: string): Promise<void> {
    const ticket = await this.getTicketForAccess(id_ticket);
    if (!ticket) return; // laisser le service gérer le 404

    const ok = await this.canReadTicketFromLoaded(ctx, ticket);
    if (!ok) throw new ForbiddenException('Accès interdit au ticket');
  }

  async canReadTicketFromLoaded(
    ctx: UserAccessContext,
    ticket: Pick<TicketModel, 'id_createur' | 'id_agent_assigne'> & {
      categories: { id_equipe: string };
    },
  ): Promise<boolean> {
    if (this.hasAtLeast(ctx, 'admin')) return true;

    if (this.hasAtLeast(ctx, 'manager')) {
      return !!ctx.equipeId && ticket.categories.id_equipe === ctx.equipeId;
    }

    if (this.hasAtLeast(ctx, 'agent')) {
      if (!ctx.equipeId) return false;
      if (ticket.id_agent_assigne === ctx.userId) return true;
      if (ticket.id_agent_assigne == null && ticket.categories.id_equipe === ctx.equipeId) return true;
      return false;
    }

    return ticket.id_createur === ctx.userId;
  }

  canSeeInternalMessages(ctx: UserAccessContext): boolean {
    return this.hasAtLeast(ctx, 'agent');
  }
}
