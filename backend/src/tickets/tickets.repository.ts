import { Injectable } from '@nestjs/common';
import { Prisma, tickets as TicketModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ticketsCreateInput): Promise<TicketModel> {
    return this.prisma.tickets.create({ data });
  }

  findMany<T extends Prisma.ticketsFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ticketsFindManyArgs>,
  ) {
    return this.prisma.tickets.findMany(args);
  }

  findByIdWith<T extends Prisma.ticketsFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.ticketsFindUniqueArgs>,
  ) {
    return this.prisma.tickets.findUnique(args);
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
