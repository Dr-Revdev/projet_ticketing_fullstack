import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageRepository } from './message.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly repo: MessageRepository) { }

  create(dto: CreateMessageDto) {
    const data: Prisma.messagesCreateInput = {
      id_message: dto.id_message,
      contenu: dto.contenu,
      visibilite: dto.visibilite,
      utilisateurs: {
        connect: { id_utilisateur: dto.id_utilisateur },
      },
      tickets: {
        connect: { id_ticket: dto.id_ticket },
      },
    };

    return this.repo.create(data);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id_message: string) {
    const message = await this.repo.findById(id_message);
    if (!message) throw new NotFoundException('Message non trouvé');
    return message;
  }

  // Pas d'update. Non nécessaire pour le moment.
  // Pas bon de toutes façons

  /*  async update(id_message: string, dto: UpdateMessageDto) {
    try {
      return await this.repo.updateById(id_message, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Message non trouvé')
      }
      throw err;
    }
  }
*/
  async remove(id_message: string) {
    try {
      return await this.repo.deleteById(id_message);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Message non trouvé');
      }
      throw err;
    }
  }
}
