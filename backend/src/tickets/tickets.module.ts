import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TicketRepository } from './tickets.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository],
})
export class TicketsModule {}
