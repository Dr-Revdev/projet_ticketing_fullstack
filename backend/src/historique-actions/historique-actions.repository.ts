import { Injectable } from "@nestjs/common";
import { Prisma, historiqueactions as HistoriqueActionModel } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class HistoriqueActionRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.historiqueactionsCreateInput): Promise<HistoriqueActionModel> {
        return this.prisma.historiqueactions.create({ data });
    }

    findAll(): Promise<HistoriqueActionModel[]> {
        return this.prisma.historiqueactions.findMany();
    }

    findById(id_action: string): Promise<HistoriqueActionModel | null> {
        return this.prisma.historiqueactions.findUnique({ where: { id_action } });
    }
}