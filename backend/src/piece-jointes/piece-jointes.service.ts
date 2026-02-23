import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
// import { UpdatePieceJointeDto } from './dto/update-piece-jointe.dto';
import { PieceJointeRepository } from './piece-jointes.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PieceJointesService {
  constructor(private readonly repo: PieceJointeRepository) {}

  create(dto: CreatePieceJointeDto) {
    const data: Prisma.piecejointesCreateInput = {
      id_piece_jointe: dto.id_piece_jointe,
      nom_fichier: dto.nom_fichier,
      url_path: dto.url_path,
      utilisateurs: {
        connect: { id_utilisateur: dto.id_utilisateur },
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

  async findOne(id_piece_jointe: string) {
    const piece_jointe = await this.repo.findById(id_piece_jointe);
    if (!piece_jointe) throw new NotFoundException('Piece jointe non trouvée')
      return piece_jointe;
  }

  // update(id: number, updatePieceJointeDto: UpdatePieceJointeDto) {
  //   return `This action updates a #${id} pieceJointe`;
  // }

  async remove(id_piece_jointe: string) {
    try {
      return await this.repo.deleteById(id_piece_jointe);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Pièce jointe non trouvée')
      }
      throw err;
    }
  }
}
