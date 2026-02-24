import { Injectable } from '@nestjs/common';
import { Prisma, categories as CategorieModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategorieRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.categoriesCreateInput): Promise<CategorieModel> {
    return this.prisma.categories.create({ data });
  }

  findAll(): Promise<CategorieModel[]> {
    return this.prisma.categories.findMany();
  }

  findById(id_categorie: string): Promise<CategorieModel | null> {
    return this.prisma.categories.findUnique({ where: { id_categorie } });
  }

  updateById(
    id_categorie: string,
    data: Prisma.categoriesUpdateInput,
  ): Promise<CategorieModel> {
    return this.prisma.categories.update({ where: { id_categorie }, data });
  }

  deleteById(id_categorie: string): Promise<CategorieModel> {
    return this.prisma.categories.delete({ where: { id_categorie } });
  }
}
