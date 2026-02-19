import { Injectable } from "@nestjs/common";
import { Prisma, utilisateurs as UtilisateurModel } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UtilisateurRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.utilisateursCreateInput): Promise<UtilisateurModel> {
        return this.prisma.utilisateurs.create({ data });
    }

    findAll(): Promise<UtilisateurModel[]> {
        return this.prisma.utilisateurs.findMany();
    }

    findById(id_utilisateur: string): Promise<UtilisateurModel | null> {
        return this.prisma.utilisateurs.findUnique({ where: { id_utilisateur } });
    }

    updateById(id_utilisateur: string, data: Prisma.utilisateursUpdateInput): Promise<UtilisateurModel> {
        return this.prisma.utilisateurs.update({ where: { id_utilisateur }, data });
    }

    deleteById(id_utilisateur: string): Promise<UtilisateurModel> {
        return this.prisma.utilisateurs.delete({ where: { id_utilisateur }});
    }
}