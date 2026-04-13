import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorieRepository } from './categories.repository';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategorieRepository) {}

  create(dto: CreateCategoryDto) {
    const data: Prisma.categoriesCreateInput = {
      id_categorie: randomUUID(),
      libelle: dto.libelle,
      equipes: {
        connect: { id_equipe: dto.id_equipe },
      },
    };
    return this.repo.create(data);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id_categorie: string) {
    const categorie = await this.repo.findById(id_categorie);
    if (!categorie) throw new NotFoundException('Catégorie non trouvée');
    return categorie;
  }

  async update(id_categorie: string, dto: UpdateCategoryDto) {
    try {
      return await this.repo.updateById(id_categorie, dto);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Catégorie non trouvée');
      }
      throw err;
    }
  }

  async remove(id_categorie: string) {
    try {
      return await this.repo.deleteById(id_categorie);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Catégorie non trouvée');
      }
      throw err;
    }
  }
}
