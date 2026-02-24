import { Injectable } from '@nestjs/common';
import { Prisma, tickets as TicketModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ticketsCreateInput): Promise<TicketModel> {
    return this.prisma.tickets.create({ data });
  }

  findAll(): Promise<TicketModel[]> {
    return this.prisma.tickets.findMany();
  }

  findById(id_ticket: string): Promise<TicketModel | null> {
    return this.prisma.tickets.findUnique({ where: { id_ticket } });
  }

  updateById(
    id_ticket: string,
    data: Prisma.ticketsUpdateInput,
  ): Promise<TicketModel> {
    return this.prisma.tickets.update({ where: { id_ticket }, data });
  }

  deleteById(id_ticket: string): Promise<TicketModel> {
    return this.prisma.tickets.delete({ where: { id_ticket } });
  }
}
