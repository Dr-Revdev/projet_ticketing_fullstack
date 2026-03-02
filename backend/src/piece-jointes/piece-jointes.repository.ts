import { Injectable } from '@nestjs/common';
import { Prisma, piecejointes as PieceJointeModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PieceJointeRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.piecejointesCreateInput): Promise<PieceJointeModel> {
    return this.prisma.piecejointes.create({ data });
  }

  findAll(): Promise<PieceJointeModel[]> {
    return this.prisma.piecejointes.findMany();
  }

  findMany<T extends Prisma.piecejointesFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.piecejointesFindManyArgs>,
  ) {
    return this.prisma.piecejointes.findMany(args);
  }

  findById(id_piece_jointe: string): Promise<PieceJointeModel | null> {
    return this.prisma.piecejointes.findUnique({ where: { id_piece_jointe } });
  }

  findByIdWith<T extends Prisma.piecejointesFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.piecejointesFindUniqueArgs>,
  ) {
    return this.prisma.piecejointes.findUnique(args);
  }

  updateById(
    id_piece_jointe: string,
    data: Prisma.piecejointesUpdateInput,
  ): Promise<PieceJointeModel> {
    return this.prisma.piecejointes.update({
      where: { id_piece_jointe },
      data,
    });
  }

  deleteById(id_piece_jointe: string): Promise<PieceJointeModel> {
    return this.prisma.piecejointes.delete({ where: { id_piece_jointe } });
  }
}
