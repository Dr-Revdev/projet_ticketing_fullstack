import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquipesModule } from './equipes/equipes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [EquipesModule, PrismaModule, UtilisateursModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
