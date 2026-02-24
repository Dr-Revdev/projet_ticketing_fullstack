import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './roles.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly repo: RoleRepository) { }

  create(dto: CreateRoleDto) {
    return this.repo.create(dto);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id_role: string) {
    const role = await this.repo.findById(id_role);
    if (!role) throw new NotFoundException('Role non trouvé');
    return role;
  }

  async update(id_role: string, dto: UpdateRoleDto) {
    try {
      return await this.repo.updateById(id_role, dto);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Role non trouvé');
      }
      throw err;
    }
  }

  async remove(id_role: string) {
    try {
      return await this.repo.deleteById(id_role);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Role non trouvé');
      }
      throw err;
    }
  }
}
