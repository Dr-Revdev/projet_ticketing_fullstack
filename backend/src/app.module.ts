import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { EquipesModule } from './equipes/equipes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { CategoriesModule } from './categories/categories.module';
import { RolesModule } from './roles/roles.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { PieceJointesModule } from './piece-jointes/piece-jointes.module';
import { HistoriqueActionsModule } from './historique-actions/historique-actions.module';
import { UtilisateursRolesModule } from './utilisateurs-roles/utilisateurs-roles.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    EquipesModule,
    PrismaModule,
    UtilisateursModule,
    CategoriesModule,
    RolesModule,
    TicketsModule,
    MessagesModule,
    PieceJointesModule,
    HistoriqueActionsModule,
    UtilisateursRolesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
