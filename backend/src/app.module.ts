import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquipesModule } from './equipes/equipes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { CategoriesModule } from './categories/categories.module';
import { RolesModule } from './roles/roles.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [EquipesModule, PrismaModule, UtilisateursModule, CategoriesModule, RolesModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
