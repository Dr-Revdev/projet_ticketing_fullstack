import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
// import { UpdatePieceJointeDto } from './dto/update-piece-jointe.dto';
import { PieceJointeRepository } from './piece-jointes.repository';
import { Prisma } from '@prisma/client';
import { AccessService } from 'src/access/access.service';

@Injectable()
export class PieceJointesService {
  constructor(
    private readonly repo: PieceJointeRepository,
    private readonly access: AccessService,
  ) { }

  async createForUser(userId: string, dto: CreatePieceJointeDto) {
    const ctx = await this.access.getUserContext(userId);

    if (dto.id_utilisateur && dto.id_utilisateur !== userId) {
      throw new ForbiddenException("id_utilisateur ne peut pas être un autre utilisateur");
    }
    await this.access.assertCanReadTicket(ctx, dto.id_ticket);

    const data: Prisma.piecejointesCreateInput = {
      id_piece_jointe: dto.id_piece_jointe,
      nom_fichier: dto.nom_fichier,
      url_path: dto.url_path,
      utilisateurs: {
        connect: { id_utilisateur: userId },
      },
      tickets: {
        connect: { id_ticket: dto.id_ticket },
      },
    };

    return this.repo.create(data);
  }

  async findAllForUser(userId: string) {
    const ctx = await this.access.getUserContext(userId);
    return this.repo.findMany({ where: { tickets: this.access.ticketWhereFor(ctx) } });
  }

  async findAllForTicket(userId: string, id_ticket: string) {
    const ctx = await this.access.getUserContext(userId);
    await this.access.assertCanReadTicket(ctx, id_ticket);
    return this.repo.findMany({ where: { id_ticket } });
  }

  async findOneForUser(userId: string, id_piece_jointe: string) {
    const ctx = await this.access.getUserContext(userId);
    const piece_jointe = await this.repo.findByIdWith({
      where: { id_piece_jointe },
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
    if (!piece_jointe) throw new NotFoundException('Piece jointe non trouvée');

    const okTicket = await this.access.canReadTicketFromLoaded(ctx, piece_jointe.tickets);
    if (!okTicket) throw new ForbiddenException('Accès interdit au ticket');
    return piece_jointe;
  }

  // update(id: number, updatePieceJointeDto: UpdatePieceJointeDto) {
  //   return `This action updates a #${id} pieceJointe`;
  // }

  async remove(id_piece_jointe: string) {
    try {
      return await this.repo.deleteById(id_piece_jointe);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Pièce jointe non trouvée');
      }
      throw err;
    }
  }
}
