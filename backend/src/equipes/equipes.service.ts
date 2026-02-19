import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { EquipeRepository } from './equipes.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class EquipesService {
  constructor(private readonly repo: EquipeRepository) {}

  create(dto: CreateEquipeDto) {
    return this.repo.create(dto);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id_equipe: string) {
    const equipe = await this.repo.findById(id_equipe);
    if (!equipe) throw new NotFoundException('Equipe non trouvée')
      return equipe;
  }

  async update(id_equipe: string, dto: UpdateEquipeDto) {
    try {
      return await this.repo.updateById(id_equipe, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Equipe non trouvée')
      }
      throw err;
    }
  }

  async remove(id_equipe: string) {
    try {
      return await this.repo.deleteById(id_equipe);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Equipe non trouvée')
      }
      throw err;
    }
  }
}
