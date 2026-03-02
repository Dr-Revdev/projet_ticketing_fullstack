import { Injectable } from '@nestjs/common';
import { Prisma, messages as MessageModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.messagesCreateInput): Promise<MessageModel> {
    return this.prisma.messages.create({ data });
  }

  findAll(): Promise<MessageModel[]> {
    return this.prisma.messages.findMany();
  }

  findMany<T extends Prisma.messagesFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.messagesFindManyArgs>,
  ) {
    return this.prisma.messages.findMany(args);
  }

  findById(id_message: string): Promise<MessageModel | null> {
    return this.prisma.messages.findUnique({ where: { id_message } });
  }

  findByIdWith<T extends Prisma.messagesFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.messagesFindUniqueArgs>,
  ) {
    return this.prisma.messages.findUnique(args);
  }

  updateById(
    id_message: string,
    data: Prisma.messagesUpdateInput,
  ): Promise<MessageModel> {
    return this.prisma.messages.update({ where: { id_message }, data });
  }

  deleteById(id_message: string): Promise<MessageModel> {
    return this.prisma.messages.delete({ where: { id_message } });
  }
}
