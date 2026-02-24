import { Injectable } from '@nestjs/common';
import { Prisma, equipes as EquipeModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.equipesCreateInput): Promise<EquipeModel> {
    return this.prisma.equipes.create({ data });
  }

  findAll(): Promise<EquipeModel[]> {
    return this.prisma.equipes.findMany();
  }

  findById(id_equipe: string): Promise<EquipeModel | null> {
    return this.prisma.equipes.findUnique({ where: { id_equipe } });
  }

  updateById(
    id_equipe: string,
    data: Prisma.equipesUpdateInput,
  ): Promise<EquipeModel> {
    return this.prisma.equipes.update({ where: { id_equipe }, data });
  }

  deleteById(id_equipe: string): Promise<EquipeModel> {
    return this.prisma.equipes.delete({ where: { id_equipe } });
  }
}
