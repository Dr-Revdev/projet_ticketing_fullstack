import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UtilisateursRolesService } from './utilisateurs-roles.service';
import { CreateUtilisateursRoleDto } from './dto/create-utilisateurs-role.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('utilisateurs')
export class UtilisateursRolesController {
  constructor(
    private readonly utilisateursRolesService: UtilisateursRolesService,
  ) { }

  @Get(':id_utilisateur/roles')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  listRoles(@Param('id_utilisateur') id_utilisateur: string) {
    return this.utilisateursRolesService.listRoles(id_utilisateur);
  }

  @Post(':id_utilisateur/roles')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  assignRole(
    @Param('id_utilisateur') id_utilisateur: string,
    @Body() dto: CreateUtilisateursRoleDto,
  ) {
    return this.utilisateursRolesService.assignRole(id_utilisateur, dto);
  }

  @Delete(':id_utilisateur/roles/:id_role')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  unassignRole(
    @Param('id_utilisateur') id_utilisateur: string,
    @Param('id_role') id_role: string,
  ) {
    return this.utilisateursRolesService.unassignRole(id_utilisateur, id_role);
  }
}
