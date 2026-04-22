import { Injectable } from '@nestjs/common';
import {
  Prisma,
  historiqueactions as HistoriqueActionModel,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoriqueActionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: Prisma.historiqueactionsUncheckedCreateInput,
  ): Promise<HistoriqueActionModel> {
    return this.prisma.historiqueactions.create({ data });
  }

  findAll(): Promise<HistoriqueActionModel[]> {
    return this.prisma.historiqueactions.findMany();
  }

  findById(id_action: string): Promise<HistoriqueActionModel | null> {
    return this.prisma.historiqueactions.findUnique({ where: { id_action } });
  }

  findByTicket(id_ticket: string) {
    return this.prisma.historiqueactions.findMany({
      where: { id_ticket },
      include: {
        utilisateurs_historiqueactions_id_auteurToutilisateurs: {
          select: { nom: true, prenom: true }
        }
      },
      orderBy: { date_action: 'asc' }
    });
  }
}
