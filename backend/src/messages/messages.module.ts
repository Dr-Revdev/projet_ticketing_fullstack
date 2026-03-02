import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MessageRepository } from './message.repository';
import { AccessModule } from 'src/access/access.module';

@Module({
  imports: [PrismaModule, AccessModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessageRepository],
})
export class MessagesModule {}
