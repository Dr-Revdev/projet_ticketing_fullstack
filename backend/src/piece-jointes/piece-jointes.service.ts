import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
import { PieceJointeRepository } from './piece-jointes.repository';
import { Prisma } from '@prisma/client';
import { AccessService } from '../access/access.service';

@Injectable()
export class PieceJointesService {
  constructor(
    private readonly repo: PieceJointeRepository,
    private readonly access: AccessService,
  ) { }

  async createForUser(userId: string, dto: CreatePieceJointeDto) {
    const ctx = await this.access.getUserContext(userId);
    await this.access.assertCanReadTicket(ctx, dto.id_ticket);

    const data: Prisma.piecejointesUncheckedCreateInput = {
      id_piece_jointe: dto.id_piece_jointe,
      nom_fichier: dto.nom_fichier,
      url_path: dto.url_path,
      id_utilisateur: userId,
      id_ticket: dto.id_ticket,
    };

    await this.repo.create(data);

    return {
      id_piece_jointe: dto.id_piece_jointe,
      nom_fichier: dto.nom_fichier,
      url_path: dto.url_path,
      id_utilisateur: userId,
      id_ticket: dto.id_ticket,
    };
  }

  async findAllForTicket(userId: string, id_ticket: string) {
    const ctx = await this.access.getUserContext(userId);
    await this.access.assertCanReadTicket(ctx, id_ticket);
    return this.repo.findMany({ where: { id_ticket } });
  }

  async remove(id_piece_jointe: string) {
    const existing = await this.repo.findById(id_piece_jointe);
    if (!existing) throw new NotFoundException('Pièce jointe non trouvée');
    return this.repo.deleteById(id_piece_jointe);
  }
}
