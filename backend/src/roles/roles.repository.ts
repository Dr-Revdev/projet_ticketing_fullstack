import { Injectable } from '@nestjs/common';
import { Prisma, roles as RoleModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.rolesCreateInput): Promise<RoleModel> {
    return this.prisma.roles.create({ data });
  }

  findAll(): Promise<RoleModel[]> {
    return this.prisma.roles.findMany();
  }

  findById(id_role: string): Promise<RoleModel | null> {
    return this.prisma.roles.findUnique({ where: { id_role } });
  }

  updateById(
    id_role: string,
    data: Prisma.rolesUpdateInput,
  ): Promise<RoleModel> {
    return this.prisma.roles.update({ where: { id_role }, data });
  }

  deleteById(id_role: string): Promise<RoleModel> {
    return this.prisma.roles.delete({ where: { id_role } });
  }
}
