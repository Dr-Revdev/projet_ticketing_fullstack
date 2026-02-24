import { Module } from '@nestjs/common';
import { HistoriqueActionsService } from './historique-actions.service';
import { HistoriqueActionsController } from './historique-actions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoriqueActionRepository } from './historique-actions.repository';

@Module({
  imports: [PrismaModule],
  controllers: [HistoriqueActionsController],
  providers: [HistoriqueActionsService, HistoriqueActionRepository],
})
export class HistoriqueActionsModule {}
