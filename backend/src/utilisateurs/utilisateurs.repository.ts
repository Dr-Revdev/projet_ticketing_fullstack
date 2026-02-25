import { Injectable } from '@nestjs/common';
import { Prisma, utilisateurs as UtilisateurModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const utilisateurPublicSelect = {
  id_utilisateur: true,
  nom: true,
  prenom: true,
  email: true,
  id_equipe: true,
  derniere_connexion: true,
} satisfies Prisma.utilisateursSelect;

type UtilisateurPublic = Prisma.utilisateursGetPayload<{
  select: typeof utilisateurPublicSelect;
}>;
@Injectable()
export class UtilisateurRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: Prisma.utilisateursCreateInput): Promise<UtilisateurPublic> {
    return this.prisma.utilisateurs.create({ data, select: utilisateurPublicSelect });
  }

  findAll(): Promise<UtilisateurPublic[]> {
    return this.prisma.utilisateurs.findMany({ select: utilisateurPublicSelect });
  }

  findById(id_utilisateur: string): Promise<UtilisateurPublic | null> {
    return this.prisma.utilisateurs.findUnique({ where: { id_utilisateur }, select: utilisateurPublicSelect, });
  }

  async findAuthByEmail(email: string) {
    return this.prisma.utilisateurs.findUnique({ where: { email }, select: { id_utilisateur: true, password_hash: true, id_equipe: true }, });
  }

  updateById(id_utilisateur: string, data: Prisma.utilisateursUpdateInput): Promise<UtilisateurPublic> {
    return this.prisma.utilisateurs.update({ where: { id_utilisateur }, data, select: utilisateurPublicSelect, });
  }

  deleteById(id_utilisateur: string): Promise<UtilisateurPublic> {
    return this.prisma.utilisateurs.delete({ where: { id_utilisateur }, select: utilisateurPublicSelect });
  }
}
