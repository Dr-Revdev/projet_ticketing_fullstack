import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateurRepository } from './utilisateurs.repository';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateursService {
  constructor(private readonly repo: UtilisateurRepository) { }

  async create(dto: CreateUtilisateurDto) {
    const password_hash = await bcrypt.hash(dto.password, 10)

    const data: Prisma.utilisateursCreateInput = {
      id_utilisateur: dto.id_utilisateur,
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      password_hash,
      password_changed_at: new Date(),
      equipes: {
        connect: { id_equipe: dto.id_equipe },
      },
    };
    return this.repo.create(data);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id_utilisateur: string) {
    const utilisateur = await this.repo.findById(id_utilisateur);
    if (!utilisateur) throw new NotFoundException('Utilisateur non trouvé');
    return utilisateur;
  }

  async update(id_utilisateur: string, dto: UpdateUtilisateurDto) {
    try {
      const data: Prisma.utilisateursUpdateInput = {};

      if (dto.nom !== undefined) data.nom = dto.nom;
      if (dto.prenom !== undefined) data.prenom = dto.prenom;
      if (dto.email !== undefined) data.email = dto.email;

      if (dto.password !== undefined) {
        data.password_hash = await bcrypt.hash(dto.password, 10);
        data.password_changed_at = new Date();
      }

      if (dto.id_equipe !== undefined) {
        data.equipes = { connect: { id_equipe: dto.id_equipe } };
      }

      return await this.repo.updateById(id_utilisateur, data);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      throw err;
    }
  }

  async remove(id_utilisateur: string) {
    try {
      return await this.repo.deleteById(id_utilisateur);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Utilistateur non trouvé');
      }
      throw err;
    }
  }
}
