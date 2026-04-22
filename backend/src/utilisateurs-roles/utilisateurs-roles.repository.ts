import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, utilisateurs_roles as UserRoleModel } from '@prisma/client';

@Injectable()
export class UtilisateursRolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  assign(id_utilisateur: string, id_role: string): Promise<UserRoleModel> {
    const data: Prisma.utilisateurs_rolesUncheckedCreateInput = {
      id_utilisateur,
      id_role,
    };

    return this.prisma.utilisateurs_roles.create({ data });
  }

  unassign(id_utilisateur: string, id_role: string): Promise<UserRoleModel> {
    return this.prisma.utilisateurs_roles.delete({
      where: {
        // Clé composite (id_utilisateur, id_role)
        id_utilisateur_id_role: { id_utilisateur, id_role },
      },
    });
  }

  listForUser(id_utilisateur: string) {
    return this.prisma.utilisateurs_roles.findMany({
      where: { id_utilisateur },
      include: { roles: true },
    });
  }
}
