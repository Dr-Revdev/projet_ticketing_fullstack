import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoriqueActionDto } from './dto/create-historique-action.dto';
import { HistoriqueActionRepository } from './historique-actions.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class HistoriqueActionsService {
  constructor(private readonly repo: HistoriqueActionRepository) { }

  create(dto: CreateHistoriqueActionDto) {
    const data: Prisma.historiqueactionsCreateInput = {
      id_action: dto.id_action,
      type_action: dto.type_action,
      detail: dto.detail,
      utilisateurs_historiqueactions_id_cibleToutilisateurs: {
        connect: { id_utilisateur: dto.id_cible },
      },
      utilisateurs_historiqueactions_id_auteurToutilisateurs: {
        connect: { id_utilisateur: dto.id_auteur },
      },
      tickets: {
        connect: { id_ticket: dto.id_ticket },
      },
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
}
