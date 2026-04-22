import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TicketRepository } from './tickets.repository';
import { AccessModule } from '../access/access.module';
import { HistoriqueActionsModule } from '../historique-actions/historique-actions.module';

@Module({
  imports: [PrismaModule, AccessModule, HistoriqueActionsModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository],
})
export class TicketsModule {}
