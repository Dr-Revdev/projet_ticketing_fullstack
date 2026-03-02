import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TicketRepository } from './tickets.repository';
import { AccessModule } from 'src/access/access.module';

@Module({
  imports: [PrismaModule, AccessModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository],
})
export class TicketsModule {}
