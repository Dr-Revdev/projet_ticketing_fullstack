import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateurRepository } from './utilisateurs.repository';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { AccessService } from '../access/access.service';

@Injectable()
export class UtilisateursService {
  constructor(
    private readonly repo: UtilisateurRepository,
    private readonly access: AccessService,
  ) { }

  async create(dto: CreateUtilisateurDto) {
    const password_hash = await bcrypt.hash(dto.password, 10)

    const data: Prisma.utilisateursCreateInput = {
      id_utilisateur: randomUUID(),
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      password_hash,
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

  async update(requesterId: string, id_utilisateur: string, dto: UpdateUtilisateurDto) {
    try {
      const data: Prisma.utilisateursUpdateInput = {};

      if (dto.id_equipe !== undefined) {
        const ctx = await this.access.getUserContext(requesterId);
        if (!this.access.isAdmin(ctx)) throw new ForbiddenException("Modification de l'équipe réservée à un admin");
        data.equipes = { connect: { id_equipe: dto.id_equipe } };
      }

      if (dto.nom !== undefined) data.nom = dto.nom;
      if (dto.prenom !== undefined) data.prenom = dto.prenom;
      if (dto.email !== undefined) data.email = dto.email;

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
