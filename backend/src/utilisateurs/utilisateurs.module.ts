import { Module } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { UtilisateursController } from './utilisateurs.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilisateurRepository } from './utilisateurs.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UtilisateursController],
  providers: [UtilisateursService, UtilisateurRepository],
})
export class UtilisateursModule {}
