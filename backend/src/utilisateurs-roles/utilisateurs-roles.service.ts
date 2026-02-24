import { Injectable } from '@nestjs/common';
import { CreateUtilisateursRoleDto } from './dto/create-utilisateurs-role.dto';
import { UtilisateursRolesRepository } from './utilisateurs-roles.repository';

@Injectable()
export class UtilisateursRolesService {
  constructor(private readonly userRolesRepo: UtilisateursRolesRepository) { }

  listRoles(id_utilisateur: string) {
    return this.userRolesRepo.listForUser(id_utilisateur);
  }

  assignRole(id_utilisateur: string, dto: CreateUtilisateursRoleDto) {
    return this.userRolesRepo.assign(id_utilisateur, dto.id_role);
  }

  unassignRole(id_utilisateur: string, id_role: string) {
    return this.userRolesRepo.unassign(id_utilisateur, id_role);
  }
}
