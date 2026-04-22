import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoriqueActionDto } from './dto/create-historique-action.dto';
import { HistoriqueActionRepository } from './historique-actions.repository';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class HistoriqueActionsService {
  constructor(private readonly repo: HistoriqueActionRepository) { }

  create(dto: CreateHistoriqueActionDto) {
    const data: Prisma.historiqueactionsUncheckedCreateInput = {
      id_action: randomUUID(),
      type_action: dto.type_action,
      detail: dto.detail,
      id_cible: dto.id_cible,
      id_auteur: dto.id_auteur,
      id_ticket: dto.id_ticket,
    };

    return this.repo.create(data);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id_action: string) {
    const action = await this.repo.findById(id_action);
    if (!action) throw new NotFoundException('Action non trouvée');
    return action;
  }

  findByTicket(id_ticket: string) {
    return this.repo.findByTicket(id_ticket);
  }
}
