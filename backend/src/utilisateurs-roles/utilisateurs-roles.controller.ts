import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UtilisateursRolesService } from './utilisateurs-roles.service';
import { CreateUtilisateursRoleDto } from './dto/create-utilisateurs-role.dto';

@Controller('utilisateurs')
export class UtilisateursRolesController {
  constructor(
    private readonly utilisateursRolesService: UtilisateursRolesService,
  ) { }

  @Get(':id_utilisateur/roles')
  listRoles(@Param('id_utilisateur') id_utilisateur: string) {
    return this.utilisateursRolesService.listRoles(id_utilisateur);
  }

  @Post(':id_utilisateur/roles')
  assignRole(
    @Param('id_utilisateur') id_utilisateur: string,
    @Body() dto: CreateUtilisateursRoleDto,
  ) {
    return this.utilisateursRolesService.assignRole(id_utilisateur, dto);
  }

  @Delete(':id_utilisateur/roles/:id_role')
  unassignRole(
    @Param('id_utilisateur') id_utilisateur: string,
    @Param('id_role') id_role: string,
  ) {
    return this.utilisateursRolesService.unassignRole(id_utilisateur, id_role);
  }
}
