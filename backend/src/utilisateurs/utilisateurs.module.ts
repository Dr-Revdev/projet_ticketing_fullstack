import { Module } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { UtilisateursController } from './utilisateurs.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilisateurRepository } from './utilisateurs.repository';
import { UtilisateursRolesModule } from '../utilisateurs-roles/utilisateurs-roles.module';
import { AccessModule } from '../access/access.module';
import { SelfOrAdminGuard } from './guards/self-or-admin.guard';

@Module({
  imports: [PrismaModule, UtilisateursRolesModule, AccessModule],
  controllers: [UtilisateursController],
  providers: [UtilisateursService, UtilisateurRepository, SelfOrAdminGuard],
  exports: [UtilisateurRepository],
})
export class UtilisateursModule {}
