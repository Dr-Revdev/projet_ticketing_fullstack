import { Injectable } from "@nestjs/common";
import { Prisma, messages as MessageModel } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessageRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.messagesCreateInput): Promise<MessageModel> {
        return this.prisma.messages.create({ data });
    } 

    findAll(): Promise<MessageModel[]> {
        return this.prisma.messages.findMany();
    }

    findById(id_message: string): Promise<MessageModel | null> {
        return this.prisma.messages.findUnique({ where: {id_message} });
    }

    updateById(id_message: string, data: Prisma.messagesUpdateInput): Promise<MessageModel> {
        return this.prisma.messages.update({ where: { id_message}, data });
    }

    deleteById(id_message: string): Promise<MessageModel> {
        return this.prisma.messages.delete({ where: { id_message } });
    }

}