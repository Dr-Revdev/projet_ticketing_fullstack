import { Module } from '@nestjs/common';
import { UtilisateursRolesService } from './utilisateurs-roles.service';
import { UtilisateursRolesController } from './utilisateurs-roles.controller';
import { UtilisateursRolesRepository } from './utilisateurs-roles.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [UtilisateursRolesRepository],
  controllers: [UtilisateursRolesController],
  providers: [UtilisateursRolesService, UtilisateursRolesRepository],
})
export class UtilisateursRolesModule {}
